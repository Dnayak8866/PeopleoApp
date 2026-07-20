import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { LeaveApplication } from '../entities/leave-application.entity';
import { LeaveApplicationDto } from '../dto/leaves.dto';
import { User } from '../entities/user.entity';
import { LeaveType } from '../entities/leave-type.entity';
import { LeaveBalance } from '../entities/leave-balance.entity';
import { NotificationService } from './notification.service';

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
        private readonly notificationService: NotificationService,
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

        const savedLeave = await this.leaveRepo.save(leave);

        try {
            // 1. Notify employee
            const formattedFrom = from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const formattedTo = to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            await this.notificationService.create(
                employee_id,
                'Leave Applied',
                `Your leave application from ${formattedFrom} to ${formattedTo} has been submitted successfully.`,
                'success'
            );

            // 2. Notify all admins in the company
            const admins = await this.userRepo.find({
                where: { companyId: employee.companyId, roleId: 1 }
            });
            for (const admin of admins) {
                await this.notificationService.create(
                    admin.id,
                    'New Leave Request',
                    `${employee.fullName} has applied for leave from ${formattedFrom} to ${formattedTo}.`,
                    'info'
                );
            }
        } catch (err) {
            console.error('Failed to generate leave apply notifications:', err);
        }

        return savedLeave;
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

        const calculateUsedLeaves = (leaveTypeId: number) => {
            return approvedLeaves
                .filter(leave => leave.leave_type_id === leaveTypeId)
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
        };

        // 3. Map balances
        const results = employeeBalances.map(b => {
            const usedLeaves = calculateUsedLeaves(b.leave_type_id);
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
            return leaveTypes.map(type => {
                const usedLeaves = calculateUsedLeaves(type.leave_type_id);
                const totalAllowed = type.leave_balance || 0;
                return {
                    leave_type_id: type.leave_type_id,
                    type_name: type.type_name,
                    total_allowed: totalAllowed,
                    used: usedLeaves,
                    remaining: totalAllowed - usedLeaves
                };
            });
        }

        return results;
    }

    async getPendingLeaves(companyId: number) {
        // Fetch all pending leaves, filter by company via subquery on users table
        const leaves: LeaveApplication[] = await this.leaveRepo
            .createQueryBuilder('l')
            .leftJoinAndSelect('l.leave_type', 'lt')
            .innerJoin('l.user', 'u')
            .where('l.status = :status', { status: 'Pending' })
            .andWhere('u.companyId = :companyId', { companyId })
            .orderBy('l.applied_at', 'DESC')
            .getMany();

        // Enrich with employee names by querying users separately
        const employeeIds = [...new Set(leaves.map(l => l.employee_id))];
        let employeeMap: Record<number, User> = {};
        if (employeeIds.length > 0) {
            const employees = await this.userRepo.findBy({ id: In(employeeIds) });
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
        
        const savedLeave = await this.leaveRepo.save(leave);
        
        try {
            const formattedFrom = new Date(leave.from_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const formattedTo = new Date(leave.to_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            await this.notificationService.create(
                leave.employee_id,
                'Leave Approved',
                `Your leave application from ${formattedFrom} to ${formattedTo} has been approved.`,
                'success'
            );
        } catch (err) {
            console.error('Failed to notify leave approval:', err);
        }

        return savedLeave;
    }

    async rejectLeave(leaveId: number): Promise<LeaveApplication> {
        const leave = await this.leaveRepo.findOne({ where: { leave_id: leaveId } });
        if (!leave) throw new NotFoundException(`Leave application ${leaveId} not found`);
        if (leave.status !== 'Pending') {
            throw new BadRequestException(`Leave application is already ${leave.status}`);
        }
        leave.status = 'Rejected';
        
        const savedLeave = await this.leaveRepo.save(leave);

        try {
            const formattedFrom = new Date(leave.from_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const formattedTo = new Date(leave.to_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            await this.notificationService.create(
                leave.employee_id,
                'Leave Rejected',
                `Your leave application from ${formattedFrom} to ${formattedTo} has been rejected.`,
                'warning'
            );
        } catch (err) {
            console.error('Failed to notify leave rejection:', err);
        }

        return savedLeave;
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
            .innerJoin('l.user', 'u')
            .where('l.status = :status', { status: 'Pending' })
            .andWhere('u.companyId = :companyId', { companyId })
            .getCount();

        return { count };
    }
}
