import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { AttendanceDto } from '../dto/attendance.dto';
import { Multer } from 'multer';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
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
}