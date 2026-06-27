import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, IsNull } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { User } from '../entities/user.entity';
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
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

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
        employeeId: dto.employee_id,
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
        employeeId: dto.employee_id,
        attendance_date: dto.attendance_date,
      },
      order: { session_number: 'DESC' },
    });

    const nextSessionNumber = (lastSession?.session_number || 0) + 1;

    // Create new punch-in session
    const attendance = this.attendanceRepository.create();
    const user = await this.userRepository.findOne({ where: { id: dto.employee_id } });
    attendance.employeeId = dto.employee_id;
    attendance.shiftId = dto.shift_id ?? user?.shiftId ?? null;
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
        employeeId: dto.employee_id,
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

  async getTodaySessionStatus(employeeId: number, dateStr?: string): Promise<{
    hasActivePunch: boolean;
    sessionNumber: number;
    punchIn: Date | null;
  }> {
    let today: Date;
    if (dateStr) {
      const [y, m, d] = dateStr.split('-').map(Number);
      today = new Date(y, m - 1, d);
    } else {
      today = new Date();
    }
    today.setHours(0, 0, 0, 0);

    const activeSession = await this.attendanceRepository.findOne({
      where: {
        employeeId: employeeId,
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
   * Returns a daily attendance summary (present, absent, on-leave, late check-ins, avg working hours)
   * for all employees of a given company on a specific date.
   */
  async getDailySummary(date: string, companyId: number) {
    // Get all active employees for the company
    const employees: User[] = await this.attendanceRepository.manager
      .getRepository(User)
      .createQueryBuilder('emp')
      .where('emp.companyId = :companyId', { companyId })
      .andWhere('emp.isActive = true')
      .andWhere('emp.isDeleted = false')
      .getMany();

    const totalEmployees = employees.length;
    if (totalEmployees === 0) {
      return { date, present: 0, absent: 0, onLeave: 0, lateCheckIns: 0, avgWorkingHours: 0, totalEmployees: 0 };
    }

    const employeeIds = employees.map((e: any) => e.employee_id || e.id);

    // Get attendance records for the date
    const records = await this.attendanceRepository
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.employee', 'emp')
      .where('a.attendance_date = :date', { date })
      .andWhere('emp.companyId = :companyId', { companyId })
      .getMany();

    // Get approved leave applications overlapping the date
    const leaveRepo = this.attendanceRepository.manager.getRepository(LeaveApplication);
    const leaveRows: any[] = await leaveRepo
      .createQueryBuilder('l')
      .select('l.employee_id')
      .where('l.status = :status', { status: 'Approved' })
      .andWhere('l.from_date <= :date', { date })
      .andWhere('l.to_date >= :date', { date })
      .andWhere('l.employee_id IN (:...ids)', { ids: employeeIds })
      .getRawMany();

    const leaveEmployeeIds: number[] = leaveRows.map(r => r.l_employee_id);
    const onLeaveSet = new Set(leaveEmployeeIds);

    let present = 0;
    let lateCheckIns = 0;
    let totalWorkingMinutes = 0;
    let workingMinutesCount = 0;

    for (const record of records) {
      const empId = (record.employee as any)?.id;
      if (!onLeaveSet.has(empId)) {
        present++;
      }
      // Late check-in: punch_in after 09:30 AM
      if (record.punch_in) {
        const punchInDate = new Date(record.punch_in);
        const punchInHour = punchInDate.getHours();
        const punchInMin = punchInDate.getMinutes();
        if (punchInHour > 9 || (punchInHour === 9 && punchInMin > 30)) {
          lateCheckIns++;
        }
      }
      // Compute average working hours from working_hours interval string "HH:MM:SS"
      if (record.working_hours) {
        const parts = record.working_hours.split(':');
        if (parts.length >= 2) {
          const mins = parseInt(parts[0]) * 60 + parseInt(parts[1]);
          totalWorkingMinutes += mins;
          workingMinutesCount++;
        }
      }
    }

    const onLeave = Array.from(onLeaveSet).filter(id => employeeIds.includes(id)).length;
    const absent = Math.max(0, totalEmployees - present - onLeave);
    const avgWorkingHours = workingMinutesCount > 0
      ? Math.round((totalWorkingMinutes / workingMinutesCount / 60) * 100) / 100
      : 0;

    return {
      date,
      totalEmployees,
      present,
      absent,
      onLeave,
      lateCheckIns,
      avgWorkingHours,
    };
  }

  /**
   * Returns all employees with their attendance status for a specific date and company.
   * Includes employees with no attendance record (marked as Absent).
   */
  async getAttendanceByDate(date: string, companyId: number) {
    // Get all active employees for the company
    const employees: User[] = await this.attendanceRepository.manager
      .getRepository(User)
      .createQueryBuilder('emp')
      .where('emp.companyId = :companyId', { companyId })
      .andWhere('emp.isActive = true')
      .andWhere('emp.isDeleted = false')
      .getMany();

    if (employees.length === 0) return [];

    const employeeIds = employees.map((e: any) => e.employee_id || e.id);

    // Get attendance records for the date
    const records = await this.attendanceRepository
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.employee', 'emp')
      .where('a.attendance_date = :date', { date })
      .andWhere('emp.companyId = :companyId', { companyId })
      .orderBy('a.session_number', 'ASC')
      .getMany();

    // Get approved leaves for these employees on this date
    const leaveRepo = this.attendanceRepository.manager.getRepository(LeaveApplication);
    const leaveRows: any[] = await leaveRepo
      .createQueryBuilder('l')
      .select('l.employee_id')
      .where('l.status = :status', { status: 'Approved' })
      .andWhere('l.from_date <= :date', { date })
      .andWhere('l.to_date >= :date', { date })
      .andWhere('l.employee_id IN (:...ids)', { ids: employeeIds })
      .getRawMany();

    const onLeaveSet = new Set<number>(leaveRows.map(r => r.l_employee_id));

    // Build a map: employeeId → latest attendance record
    const attendanceMap = new Map<number, Attendance>();
    for (const record of records) {
      const empId = (record.employee as any)?.id;
      if (empId) attendanceMap.set(empId, record);
    }

    const formatTime = (ts: Date | null): string | null => {
      if (!ts) return null;
      return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const formatDuration = (workingHours: string | null): string => {
      if (!workingHours) return '0h:00m';
      const parts = workingHours.split(':');
      if (parts.length >= 2) return `${parseInt(parts[0])}h:${parts[1]}m`;
      return '0h:00m';
    };

    return employees.map((emp: any) => {
      const empId = emp.employee_id || emp.id;
      const record = attendanceMap.get(empId);
      const isOnLeave = onLeaveSet.has(empId);

      let status: string = 'Absent';
      if (isOnLeave) {
        status = 'Leave';
      } else if (record) {
        if (record.punch_in) {
          const punchInDate = new Date(record.punch_in);
          const h = punchInDate.getHours();
          const m = punchInDate.getMinutes();
          status = (h > 9 || (h === 9 && m > 30)) ? 'Late' : 'Present';
        } else {
          status = record.status || 'Present';
        }
      }

      return {
        id: empId,
        name: emp.full_name || emp.fullName || '',
        designation: emp.designation_id ? String(emp.designation_id) : '',
        avatar: emp.avatar || null,
        status,
        entryTime: record ? formatTime(record.punch_in) : null,
        exitTime: record ? formatTime(record.punch_out) : null,
        duration: record ? formatDuration(record.working_hours) : '0h:00m',
      };
    });
  }

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
   * excluding holidays and weekends.
   */
  async getEmployeeMonthlyPercentage(employeeId: number, month: number, year: number, companyId?: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const startStr = startDate.toISOString().slice(0, 10);
    const endStr = endDate.toISOString().slice(0, 10);

    // Fetch holidays in the range
    const holidayWhere: any = { holiday_date: Between(startDate, endDate) };
    if (companyId) holidayWhere.company_id = companyId;
    const holidays = await this.holidayRepository.find({ where: holidayWhere });
    const holidaySet = new Set(
      holidays.map(h =>
        (h.holiday_date instanceof Date ? h.holiday_date : new Date(h.holiday_date as any))
          .toISOString().slice(0, 10)
      )
    );

    // Fetch attendance records for employee in range
    const records = await this.attendanceRepository.createQueryBuilder('a')
      .where('a.employeeId = :employeeId', { employeeId })
      .andWhere('a.attendance_date BETWEEN :start AND :end', { start: startStr, end: endStr })
      .getMany();

    const presentDaysSet = new Set<string>();
    for (const r of records) {
      const dayKey = (r.attendance_date instanceof Date)
        ? r.attendance_date.toISOString().slice(0, 10)
        : new Date(r.attendance_date as any).toISOString().slice(0, 10);
      const isPresent = (r.status && r.status.toLowerCase() !== 'absent') || (r.punch_in != null || r.punch_out != null);
      if (isPresent) presentDaysSet.add(dayKey);
    }

    // Compute working days excluding weekends and holidays
    const days: string[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      const dayOfWeek = d.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue; // skip weekends
      if (holidaySet.has(key)) continue;
      days.push(key);
    }
    const totalDays = days.length;

    const presentDays = Array.from(presentDaysSet).filter(d => days.includes(d)).length;
    const absentDays = Math.max(0, totalDays - presentDays);
    const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 10000) / 100 : 0;

    return { employeeId, month, year, companyId: companyId ?? null, totalDays, presentDays, absentDays, percentage };
  }

  /**
   * Returns attendance statistics for an employee for a specific month.
   * Useful for the employee reports screen.
   */
  async getEmployeeStats(employeeId: number, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const startStr = startDate.toISOString().slice(0, 10);
    const endStr = endDate.toISOString().slice(0, 10);

    // Get attendance records
    const records = await this.attendanceRepository.createQueryBuilder('a')
      .where('a.employeeId = :employeeId', { employeeId })
      .andWhere('a.attendance_date BETWEEN :start AND :end', { start: startStr, end: endStr })
      .orderBy('a.attendance_date', 'ASC')
      .getMany();

    // Get total leaves taken in this month
    const leaveRepo = this.attendanceRepository.manager.getRepository(LeaveApplication);
    const leaves = await leaveRepo.createQueryBuilder('l')
      .where('l.employee_id = :employeeId', { employeeId })
      .andWhere('l.status = :status', { status: 'Approved' })
      .andWhere(
        '((l.from_date <= :end AND l.to_date >= :start))',
        { start: startStr, end: endStr }
      )
      .getMany();

    let totalWorkingMinutes = 0;
    let daysWithWorkingHours = 0;
    const dailyWorkingHours: any[] = [];

    // Map records to chart data
    for (const record of records) {
      let mins = 0;
      if (record.working_hours) {
        const parts = record.working_hours.split(':');
        if (parts.length >= 2) {
          mins = parseInt(parts[0]) * 60 + parseInt(parts[1]);
          totalWorkingMinutes += mins;
          daysWithWorkingHours++;
        }
      }
      dailyWorkingHours.push({
        date: record.attendance_date,
        hours: Math.round((mins / 60) * 10) / 10,
      });
    }

    const { totalDays, presentDays, absentDays, percentage } = await this.getEmployeeMonthlyPercentage(employeeId, month, year);

    return {
      monthlySummary: {
        totalDays,
        presentDays,
        absentDays,
        onLeaveDays: leaves.length, // Rough count
        attendancePercentage: percentage,
        avgWorkingHours: daysWithWorkingHours > 0
          ? Math.round((totalWorkingMinutes / daysWithWorkingHours / 60) * 10) / 10
          : 0,
      },
      chartData: dailyWorkingHours,
    };
  }

  async getEmployeeAttendanceHistory(employeeId: number, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const startStr = startDate.toISOString().slice(0, 10);
    const endStr = endDate.toISOString().slice(0, 10);

    // Fetch attendance records sorted newest first
    const records = await this.attendanceRepository.createQueryBuilder('a')
      .where('a.employeeId = :employeeId', { employeeId })
      .andWhere('a.attendance_date BETWEEN :start AND :end', { start: startStr, end: endStr })
      .orderBy('a.attendance_date', 'DESC')
      .getMany();

    // Get approved leaves in this period
    const leaveRepo = this.attendanceRepository.manager.getRepository(LeaveApplication);
    const leaves: any[] = await leaveRepo.createQueryBuilder('l')
      .leftJoinAndSelect('l.leave_type', 'lt')
      .where('l.employee_id = :employeeId', { employeeId })
      .andWhere('l.status = :status', { status: 'Approved' })
      .andWhere('l.from_date <= :end AND l.to_date >= :start', { start: startStr, end: endStr })
      .getMany();

    // Build a set of leave dates
    const leaveDateMap = new Map<string, string>();
    for (const leave of leaves) {
      const from = new Date(leave.from_date);
      const to = new Date(leave.to_date);
      for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().slice(0, 10);
        leaveDateMap.set(key, leave.leave_type?.type_name || 'Leave');
      }
    }

    const formatTime = (ts: Date | null): string | null => {
      if (!ts) return null;
      return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const formatWorkedHours = (workingHours: string | null): string => {
      if (!workingHours) return '0h 0m';
      const parts = workingHours.split(':');
      if (parts.length >= 2) return `${parseInt(parts[0])}h ${parseInt(parts[1])}m`;
      return '0h 0m';
    };

    const getStatus = (record: Attendance, dateKey: string): string => {
      if (leaveDateMap.has(dateKey)) return 'Leave';
      if (!record.punch_in) return 'Absent';
      const punchInDate = new Date(record.punch_in);
      const h = punchInDate.getHours();
      const m = punchInDate.getMinutes();
      return (h > 9 || (h === 9 && m > 30)) ? 'Late' : 'Present';
    };

    return records.map(record => {
      const dateKey = (record.attendance_date instanceof Date)
        ? record.attendance_date.toISOString().slice(0, 10)
        : new Date(record.attendance_date as any).toISOString().slice(0, 10);
      const status = getStatus(record, dateKey);
      return {
        date: dateKey,
        punchIn: formatTime(record.punch_in),
        punchOut: formatTime(record.punch_out),
        workedHours: formatWorkedHours(record.working_hours),
        status,
        leaveType: leaveDateMap.get(dateKey) || null,
      };
    });
  }

  /**
   * Returns monthly attendance statistics for a whole company.
   * Uses a single bulk query instead of per-day getDailySummary calls to avoid N+1 performance issues.
   */
  async getCompanyMonthlyStats(companyId: number, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const startStr = startDate.toISOString().slice(0, 10);
    const endStr = endDate.toISOString().slice(0, 10);

    // Single query: fetch all attendance records for the company for the entire month
    const records = await this.attendanceRepository
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.employee', 'emp')
      .where('a.attendance_date BETWEEN :start AND :end', { start: startStr, end: endStr })
      .andWhere('emp.companyId = :companyId', { companyId })
      .andWhere('emp.isActive = true')
      .andWhere('emp.isDeleted = false')
      .getMany();

    // Group records by date string for trend data
    const byDate = new Map<string, Attendance[]>();
    for (const record of records) {
      const dateKey = (record.attendance_date instanceof Date)
        ? record.attendance_date.toISOString().slice(0, 10)
        : new Date(record.attendance_date as any).toISOString().slice(0, 10);
      if (!byDate.has(dateKey)) byDate.set(dateKey, []);
      byDate.get(dateKey)!.push(record);
    }

    let totalPresent = 0;
    let totalLate = 0;
    let totalWorkingMins = 0;
    let recordsCount = 0;
    const trendData: any[] = [];

    for (const [date, dayRecords] of Array.from(byDate.entries()).sort()) {
      let dayPresent = 0;
      let dayLate = 0;

      for (const record of dayRecords) {
        if (record.punch_in) {
          dayPresent++;
          const punchInDate = new Date(record.punch_in);
          const h = punchInDate.getHours();
          const m = punchInDate.getMinutes();
          if (h > 9 || (h === 9 && m > 30)) dayLate++;
        }
        if (record.working_hours) {
          const parts = record.working_hours.split(':');
          if (parts.length >= 2) {
            totalWorkingMins += parseInt(parts[0]) * 60 + parseInt(parts[1]);
            recordsCount++;
          }
        }
      }

      totalPresent += dayPresent;
      totalLate += dayLate;
      trendData.push({ date, present: dayPresent, late: dayLate });
    }

    return {
      companySummary: {
        totalPresent,
        totalLate,
        avgAttendance: recordsCount > 0 ? Math.round((totalPresent / (totalPresent + totalLate || 1)) * 100) : 0,
        avgWorkingHours: recordsCount > 0 ? Math.round((totalWorkingMins / recordsCount / 60) * 10) / 10 : 0,
      },
      trendData,
    };
  }
}