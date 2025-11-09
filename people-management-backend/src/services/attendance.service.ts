import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { AttendanceDto } from '../dto/attendance.dto';
import { Holiday } from '../entities/holiday.entity';
import { Multer } from 'multer';

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
    punch_in_photo?: Multer.File,
    punch_out_photo?: Multer.File,
  ): Promise<Attendance> {
    // Check for duplicate attendance
    const exists = await this.attendanceRepository.findOne({
      where: {
        employee: { id: dto.employee_id }, // Pass relation object
        attendance_date: dto.attendance_date,
      },
    });
    if (exists) throw new ConflictException('Attendance already marked for this date');

    const attendance = this.attendanceRepository.create({
      ...dto,
      punch_in_photo: punch_in_photo ? punch_in_photo.buffer.toString('base64') : undefined,
      punch_out_photo: punch_out_photo ? punch_out_photo.buffer.toString('base64') : undefined,
    });
    return this.attendanceRepository.save(attendance);
  }

  async findOne(id: number): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { attendance_id: id },
      relations: ['employee', 'shift'],
    });
    if (!attendance) throw new NotFoundException('Attendance not found');
    return attendance;
  }

  /**
   * Calculate attendance percentage for a given employee for a specific month/year,
   * excluding holidays (optionally filtered by companyId).
   */
  async getEmployeeMonthlyPercentage(employeeId: number, month: number, year: number, companyId?: number) {
    // compute date range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const startStr = startDate.toISOString().slice(0, 10);
    const endStr = endDate.toISOString().slice(0, 10);

    // fetch holidays in the range (optionally by company)
    const holidayWhere: any = { holiday_date: Between(startDate, endDate) };
    if (companyId) holidayWhere.company_id = companyId;
    const holidays = await this.holidayRepository.find({ where: holidayWhere });
    const holidaySet = new Set(holidays.map(h => (h.holiday_date instanceof Date ? h.holiday_date.toISOString().slice(0,10) : new Date(h.holiday_date).toISOString().slice(0,10))));

    // fetch attendance records for employee in range
    const records = await this.attendanceRepository.createQueryBuilder('a')
      .where('a.employee_id = :employeeId', { employeeId })
      .andWhere('a.attendance_date BETWEEN :start AND :end', { start: startStr, end: endStr })
      .getMany();

    const presentDaysSet = new Set<string>();
    for (const r of records) {
      const dayKey = (r.attendance_date instanceof Date) ? r.attendance_date.toISOString().slice(0,10) : new Date(r.attendance_date).toISOString().slice(0,10);
      const isPresent = (r.status && r.status.toLowerCase() !== 'absent') || (r.punch_in != null || r.punch_out != null);
      if (isPresent) presentDaysSet.add(dayKey);
    }

    // compute total working days excluding holidays
    let totalDays = 0;
    const days: string[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0,10);
      if (holidaySet.has(key)) continue;
      days.push(key);
    }
    totalDays = days.length;

    const presentDays = Array.from(presentDaysSet).filter(d => days.includes(d)).length;
    const absentDays = Math.max(0, totalDays - presentDays);
    const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 10000) / 100 : 0;

    return { employeeId, month, year, companyId: companyId ?? null, totalDays, presentDays, absentDays, percentage };
  }
}