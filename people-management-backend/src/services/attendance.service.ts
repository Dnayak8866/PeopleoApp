import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, IsNull } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { AttendanceDto } from '../dto/attendance.dto';
import { PunchInDto } from '../dto/punch-in.dto';
import { PunchOutDto } from '../dto/punch-out.dto';
import { Multer } from 'multer';
import { Holiday } from '../entities/holiday.entity';
import { LeaveApplication } from '../entities/leave-application.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  @InjectRepository(Holiday)
  private holidayRepository: Repository<Holiday>,
  ) {}

  async create(
    dto: AttendanceDto,
  ): Promise<Attendance> {
    const exists = await this.attendanceRepository.findOne({
      where: {
        employee: { id: dto.employee_id },
        attendance_date: dto.attendance_date,
      },
    });
    if (exists) throw new ConflictException('Duplicate Punch, Attendance already marked for today');

    const attendance = this.attendanceRepository.create(dto);
    return this.attendanceRepository.save(attendance);
  }

  async punchIn(dto: PunchInDto): Promise<Attendance> {
    // Check if there's an incomplete session (punch-in without punch-out)
    const incompleteSession = await this.attendanceRepository.findOne({
      where: {
        employee: { id: dto.employee_id },
        attendance_date: dto.attendance_date,
        punch_out: IsNull(),
      },
      order: { attendance_id: 'DESC' },
    });

    if (incompleteSession) {
      throw new ConflictException('Previous session not completed. Please punch out first.');
    }

    // Get the next session number
    const lastSession = await this.attendanceRepository.findOne({
      where: {
        employee: { id: dto.employee_id },
        attendance_date: dto.attendance_date,
      },
      order: { session_number: 'DESC' },
    });

    const nextSessionNumber = (lastSession?.session_number || 0) + 1;

    // Create new punch-in session
    const attendance = this.attendanceRepository.create();
    attendance.employee = { id: dto.employee_id } as any;
    attendance.attendance_date = dto.attendance_date;
    attendance.session_number = nextSessionNumber;
    attendance.punch_in = new Date();
    if (dto.punch_in_latitude !== undefined) {
      attendance.punch_in_latitude = dto.punch_in_latitude;
    }
    if (dto.punch_in_longitude !== undefined) {
      attendance.punch_in_longitude = dto.punch_in_longitude;
    }
    attendance.is_punch_in_from_office = dto.is_punch_in_from_office ?? true;
    attendance.is_punch_out_from_office = true;
    attendance.status = 'Present';

    return this.attendanceRepository.save(attendance);
  }

  async punchOut(dto: PunchOutDto): Promise<Attendance> {
    // Find the incomplete session (punch-in without punch-out)
    const session = await this.attendanceRepository.findOne({
      where: {
        employee: { id: dto.employee_id },
        attendance_date: dto.attendance_date,
        punch_out: IsNull(),
      },
      order: { attendance_id: 'DESC' },
    });

    if (!session) {
      throw new NotFoundException('No active punch-in session found. Please punch in first.');
    }

    // Update punch-out details
    session.punch_out = new Date();
    if (dto.punch_out_latitude !== undefined) {
      session.punch_out_latitude = dto.punch_out_latitude;
    }
    if (dto.punch_out_longitude !== undefined) {
      session.punch_out_longitude = dto.punch_out_longitude;
    }
    session.is_punch_out_from_office = dto.is_punch_out_from_office ?? true;

    // Calculate working hours
    if (session.punch_in && session.punch_out) {
      const diffMs = session.punch_out.getTime() - session.punch_in.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      session.working_hours = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    }

    return this.attendanceRepository.save(session);
  }

  async getTodaySessionStatus(employeeId: number): Promise<{
    hasActivePunch: boolean;
    sessionNumber: number;
    punchIn: Date | null;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeSession = await this.attendanceRepository.findOne({
      where: {
        employee: { id: employeeId },
        attendance_date: today,
        punch_out: IsNull(),
      },
      order: { attendance_id: 'DESC' },
    });

    if (activeSession) {
      return {
        hasActivePunch: true,
        sessionNumber: activeSession.session_number,
        punchIn: activeSession.punch_in,
      };
    }

    return {
      hasActivePunch: false,
      sessionNumber: 0,
      punchIn: null,
    };
  }

  /**
   * Returns day-wise attendance for an employee for a given month and year.
   * Each day will contain punch_in, punch_out, working_hours and status
   * status priority: Holiday > On Leave > Present > Absent
   */
  // async getMonthlyAttendance(employee_id: number, month: number, year: number, company_id?: number) {
  //   const startDate = new Date(year, month - 1, 1);
  //   const endDate = new Date(year, month, 0); // last day of month
  //   console.log("1")
  //   // fetch attendances for employee in range
  //   const attendances = await this.attendanceRepository.find({
  //     where: {
  //       employee: { id: employee_id },
  //       attendance_date: Between(startDate, endDate),
  //     },
  //   });
  //   console.log(attendances[0])
  //   // fetch holidays in range (optionally scoped to company)
  //   const holidayRepo = this.attendanceRepository.manager.getRepository(Holiday);
  //   const holidayWhere: any = { holiday_date: Between(startDate, endDate) };
  //   if (company_id) holidayWhere.company_id = company_id;
  //   const holidays = await holidayRepo.find({ where: holidayWhere });

  //   // fetch leave applications overlapping the period for the employee
  //   const leaveRepo = this.attendanceRepository.manager.getRepository(LeaveApplication);
  //   const leaves = await leaveRepo.createQueryBuilder('l')
  //     .where('l.employee_id = :eid', { eid: employee_id })
  //     .andWhere('NOT (l.to_date < :start OR l.from_date > :end)', { start: startDate, end: endDate })
  //     .getMany();

  //   // map attendances, holidays and leaves by date for quick lookup
  // const attendanceMap: Map<string, Attendance> = new Map();
  // const holidaySet: Map<string, Holiday> = new Map();
  // const leaveDays: Set<string> = new Set();

  // const toKey = (v: Date | string | null | undefined) => {
  //   if (!v) return '';
  //   const d = v instanceof Date ? v : new Date(v as string);
  //   if (isNaN(d.getTime())) return '';
  //   return d.toISOString().slice(0, 10);
  // };

  // attendances.forEach(a => {
  //   const key = toKey((a as any).attendance_date);
  //   if (key) attendanceMap.set(key, a);
  // });

  // holidays.forEach(h => {
  //   const key = toKey((h as any).holiday_date);
  //   if (key) holidaySet.set(key, h);
  // });

  // leaves.forEach(l => {
  //   const from = new Date(l.from_date);
  //   const to = new Date(l.to_date);
  //   if (isNaN(from.getTime()) || isNaN(to.getTime())) return;
  //   for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
  //     const key = d.toISOString().slice(0, 10);
  //     leaveDays.add(key);
  //   }
  // });

  // const result: any[] = [];
  //   for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate()+1)) {
  //     const key = d.toISOString().slice(0,10);
  //     const rec: any = { date: key, punch_in: null, punch_out: null, working_hours: null, status: 'Absent' };

  //     if (holidaySet.has(key)) {
  //       rec.status = 'Holiday';
  //     }
  //     if (leaveDays.has(key)) {
  //       rec.status = 'On Leave';
  //     }
  //     if (attendanceMap.has(key)) {
  //       const a = attendanceMap.get(key);
  //       if (a) {
  //         rec.punch_in = a.punch_in;
  //         rec.punch_out = a.punch_out;
  //         rec.working_hours = a.working_hours;
  //         rec.status = a.status || 'Present';
  //       }
  //     }

  //     result.push(rec);
  //   }

  //   return result;
  // }

  async findOne(id: number): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { attendance_id: id },
      relations: ['employee'],
    });
    if (!attendance) throw new NotFoundException('Attendance not found');
    return attendance;
  }

  /**
   * Calculate attendance percentage for a given employee for a specific month/year,
   * excluding holidays (optionally filtered by companyId).
   */
  // async getEmployeeMonthlyPercentage(employeeId: number, month: number, year: number, companyId?: number) {
  //   // compute date range for the month
  //   const startDate = new Date(year, month - 1, 1);
  //   const endDate = new Date(year, month, 0);

  //   const startStr = startDate.toISOString().slice(0, 10);
  //   const endStr = endDate.toISOString().slice(0, 10);

  //   // fetch holidays in the range (optionally by company)
  //   const holidayWhere: any = { holiday_date: Between(startDate, endDate) };
  //   if (companyId) holidayWhere.company_id = companyId;
  //   const holidays = await this.holidayRepository.find({ where: holidayWhere });
  //   const holidaySet = new Set(holidays.map(h => (h.holiday_date instanceof Date ? h.holiday_date.toISOString().slice(0,10) : new Date(h.holiday_date).toISOString().slice(0,10))));

  //   // fetch attendance records for employee in range
  //   const records = await this.attendanceRepository.createQueryBuilder('a')
  //     .where('a.employee_id = :employeeId', { employeeId })
  //     .andWhere('a.attendance_date BETWEEN :start AND :end', { start: startStr, end: endStr })
  //     .getMany();

  //   const presentDaysSet = new Set<string>();
  //   for (const r of records) {
  //     const dayKey = (r.attendance_date instanceof Date) ? r.attendance_date.toISOString().slice(0,10) : new Date(r.attendance_date).toISOString().slice(0,10);
  //     const isPresent = (r.status && r.status.toLowerCase() !== 'absent') || (r.punch_in != null || r.punch_out != null);
  //     if (isPresent) presentDaysSet.add(dayKey);
  //   }

  //   // compute total working days excluding holidays
  //   let totalDays = 0;
  //   const days: string[] = [];
  //   for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
  //     const key = d.toISOString().slice(0,10);
  //     if (holidaySet.has(key)) continue;
  //     days.push(key);
  //   }
  //   totalDays = days.length;

  //   const presentDays = Array.from(presentDaysSet).filter(d => days.includes(d)).length;
  //   const absentDays = Math.max(0, totalDays - presentDays);
  //   const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 10000) / 100 : 0;

  //   return { employeeId, month, year, companyId: companyId ?? null, totalDays, presentDays, absentDays, percentage };
  // }
}