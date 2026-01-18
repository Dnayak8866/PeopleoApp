import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { ShiftTiming } from './shift-timing.entity';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('increment')
  attendance_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'employee_id' })
  employee: User;

  @Column({ type: 'date' })
  attendance_date: Date;

  @Column({ type: 'int', default: 1 })
  session_number: number;

  @Column({ type: 'timestamp', nullable: true })
  punch_in: Date;

  @Column({ type: 'timestamp', nullable: true })
  punch_out: Date;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  punch_in_latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  punch_in_longitude: number;

  @Column({ type: 'boolean', default: true })
  is_punch_in_from_office: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  punch_out_latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  punch_out_longitude: number;

  @Column({ type: 'boolean', default: true })
  is_punch_out_from_office: boolean;

  @Column({ type: 'interval', nullable: true })
  working_hours: string;

  @Column({ length: 50, default: 'Present' })
  status: string;
}