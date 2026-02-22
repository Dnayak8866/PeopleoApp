import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveApplication } from '../entities/leave-application.entity';
import { LeaveApplicationDto } from '../dto/leaves.dto';
import { User } from '../entities/user.entity';
import { LeaveType } from '../entities/leave-type.entity';
import { LeaveBalance } from '../entities/leave-balance.entity';

@Injectable()
export class LeaveApplicationService {
    constructor(
        @InjectRepository(LeaveApplication)
        private readonly leaveRepo: Repository<LeaveApplication>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(LeaveType)
        private readonly leaveTypeRepo: Repository<LeaveType>,
        @InjectRepository(LeaveBalance)
        private readonly balanceRepo: Repository<LeaveBalance>,
    ) { }

    async applyLeave(dto: LeaveApplicationDto): Promise<LeaveApplication> {
        const { employee_id, from_date, to_date } = dto;

        // Validate employee exists
        const employee = await this.userRepo.findOne({ where: { id: employee_id } });
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${employee_id} not found`);
        }

        // Validate dates
        const from = new Date(from_date);
        const to = new Date(to_date);
        if (from > to) {
            throw new BadRequestException('From date cannot be after to date');
        }

        // Check for overlapping leaves
        // Optimization: Ensure no overlap in leave dates for the same employee
        const overlappingLeave = await this.leaveRepo.createQueryBuilder('leave')
            .where('leave.employee_id = :employee_id', { employee_id })
            .andWhere('leave.status NOT IN (:...statuses)', { statuses: ['Rejected', 'Cancelled'] })
            .andWhere(
                '((leave.from_date <= :to AND leave.to_date >= :from))',
                { from: from_date, to: to_date }
            )
            .getOne();

        if (overlappingLeave) {
            throw new ConflictException(
                `Leave already applied for the requested dates (Status: ${overlappingLeave.status})`
            );
        }

        const leave = this.leaveRepo.create({
            ...dto,
            from_date: from,
            to_date: to,
            status: 'Pending',
            applied_at: new Date(),
        });

        return this.leaveRepo.save(leave);
    }

    async getEmployeeLeaves(employee_id: number): Promise<LeaveApplication[]> {
        return this.leaveRepo.find({
            where: { employee_id },
            relations: ['leave_type'],
            order: { applied_at: 'DESC' },
        });
    }

    async getLeaveBalances(employee_id: number, company_id: number) {
        const currentYear = new Date().getFullYear();

        // 1. Get balances for the specific employee and current year
        const employeeBalances = await this.balanceRepo.find({
            where: { employee_id, year: currentYear },
            relations: ['leave_type']
        });

        // 2. Get all approved leave applications for the employee in the current year
        const approvedLeaves = await this.leaveRepo.createQueryBuilder('leave')
            .where('leave.employee_id = :employee_id', { employee_id })
            .andWhere('leave.status = :status', { status: 'Approved' })
            .andWhere('EXTRACT(YEAR FROM leave.from_date) = :year', { year: currentYear })
            .getMany();

        // 3. Map balances
        const results = employeeBalances.map(b => {
            const usedLeaves = approvedLeaves
                .filter(leave => leave.leave_type_id === b.leave_type_id)
                .reduce((total, leave) => {
                    if (leave.duration === 'Half Day') {
                        return total + 0.5;
                    }
                    const from = new Date(leave.from_date);
                    const to = new Date(leave.to_date);
                    const diffTime = Math.abs(to.getTime() - from.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    return total + diffDays;
                }, 0);

            const totalAllocated = Number(b.balance) + Number(b.carried_forward);

            return {
                leave_type_id: b.leave_type_id,
                type_name: b.leave_type?.type_name || 'Unknown',
                total_allowed: totalAllocated,
                used: usedLeaves,
                remaining: totalAllocated - usedLeaves
            };
        });

        // Fallback: If no balances in leave_balances table, fallback to leave_types (optional, but good for robust UX)
        if (results.length === 0) {
            const leaveTypes = await this.leaveTypeRepo.find({ where: { company_id } });
            return leaveTypes.map(type => ({
                leave_type_id: type.leave_type_id,
                type_name: type.type_name,
                total_allowed: type.leave_balance || 0,
                used: 0,
                remaining: type.leave_balance || 0
            }));
        }

        return results;
    }

    async getPendingLeaves(companyId: number) {
        const leaves: LeaveApplication[] = await this.leaveRepo
            .createQueryBuilder('l')
            .leftJoinAndSelect('l.leave_type', 'lt')
            .innerJoin('employees', 'emp', 'emp.employee_id = l.employee_id')
            .where('l.status = :status', { status: 'Pending' })
            .andWhere('emp.company_id = :companyId', { companyId })
            .addSelect(['emp.full_name', 'emp.employee_id'])
            .orderBy('l.applied_at', 'DESC')
            .getMany();

        // Enrich with employee names by querying users separately
        const employeeIds = [...new Set(leaves.map(l => l.employee_id))];
        let employeeMap: Record<number, User> = {};
        if (employeeIds.length > 0) {
            const employees = await this.userRepo.findByIds(employeeIds);
            employeeMap = employees.reduce((acc, emp) => {
                acc[emp.id] = emp;
                return acc;
            }, {} as Record<number, User>);
        }

        return leaves.map(l => ({
            leave_id: l.leave_id,
            employee_id: l.employee_id,
            employee_name: employeeMap[l.employee_id]?.fullName || 'Unknown',
            employee_avatar: null,
            leave_type: l.leave_type?.type_name || 'General',
            from_date: l.from_date,
            to_date: l.to_date,
            reason: l.reason || '',
            applied_at: l.applied_at,
            status: l.status,
        }));
    }

    async approveLeave(leaveId: number, approvedBy: number): Promise<LeaveApplication> {
        const leave = await this.leaveRepo.findOne({ where: { leave_id: leaveId } });
        if (!leave) throw new NotFoundException(`Leave application ${leaveId} not found`);
        if (leave.status !== 'Pending') {
            throw new BadRequestException(`Leave application is already ${leave.status}`);
        }
        leave.status = 'Approved';
        leave.approved_by = approvedBy;
        return this.leaveRepo.save(leave);
    }

    async rejectLeave(leaveId: number): Promise<LeaveApplication> {
        const leave = await this.leaveRepo.findOne({ where: { leave_id: leaveId } });
        if (!leave) throw new NotFoundException(`Leave application ${leaveId} not found`);
        if (leave.status !== 'Pending') {
            throw new BadRequestException(`Leave application is already ${leave.status}`);
        }
        leave.status = 'Rejected';
        return this.leaveRepo.save(leave);
    }

    async getEmployeeLeaveCount(employeeId: number, year: number): Promise<{ total_leaves_taken: number }> {
        const approvedLeaves = await this.leaveRepo.createQueryBuilder('leave')
            .where('leave.employee_id = :employeeId', { employeeId })
            .andWhere('leave.status = :status', { status: 'Approved' })
            .andWhere('EXTRACT(YEAR FROM leave.from_date) = :year', { year })
            .getMany();

        const totalDays = approvedLeaves.reduce((total, leave) => {
            if (leave.duration === 'Half Day') {
                return total + 0.5;
            }
            const from = new Date(leave.from_date);
            const to = new Date(leave.to_date);
            const diffTime = Math.abs(to.getTime() - from.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            return total + diffDays;
        }, 0);

        return { total_leaves_taken: totalDays };
    }

    async getPendingLeavesCount(companyId: number): Promise<{ count: number }> {
        const count = await this.leaveRepo
            .createQueryBuilder('l')
            .innerJoin('employees', 'emp', 'emp.employee_id = l.employee_id')
            .where('l.status = :status', { status: 'Pending' })
            .andWhere('emp.company_id = :companyId', { companyId })
            .getCount();

        return { count };
    }
}
