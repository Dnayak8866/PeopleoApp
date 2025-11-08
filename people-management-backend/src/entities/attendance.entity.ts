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

  @Column({ type: 'timestamp', nullable: true })
  punch_in: Date;

  @Column({ type: 'timestamp', nullable: true })
  punch_out: Date;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  punch_in_latitude: number;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  punch_in_longitude: number;

  @Column({ type: 'text', nullable: true })
  punch_in_photo: string;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  punch_out_latitude: number;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  punch_out_longitude: number;

  @Column({ type: 'text', nullable: true })
  punch_out_photo: string;

  @ManyToOne(() => ShiftTiming)
  @JoinColumn({ name: 'shift_id' })
  shift: ShiftTiming;

  @Column({ type: 'date' })
  attendance_date: Date;

  @Column({ type: 'interval', nullable: true })
  working_hours: string;

  @Column({ length: 50, default: 'Present' })
  status: string;
}