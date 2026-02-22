import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { LeaveType } from './leave-type.entity';

@Entity('leave_applications')
export class LeaveApplication {
  @PrimaryGeneratedColumn({ name: 'leave_id' })
  leave_id: number;

  @Column({ name: 'employee_id', type: 'int' })
  employee_id: number;

  @Column({ name: 'leave_type_id', type: 'int', nullable: true })
  leave_type_id: number;

  @ManyToOne(() => LeaveType)
  @JoinColumn({ name: 'leave_type_id' })
  leave_type: LeaveType;

  @Column({ name: 'from_date', type: 'date' })
  from_date: Date;

  @Column({ name: 'to_date', type: 'date' })
  to_date: Date;

  @Column({ name: 'reason', type: 'text', nullable: true })
  reason?: string;

  @Column({ name: 'status', length: 50, default: 'Pending' })
  status: string;

  @Column({ name: 'duration', length: 20, default: 'Full Day' })
  duration: string;

  @Column({ name: 'applied_at', type: 'timestamp', nullable: true })
  applied_at?: Date;

  @Column({ name: 'approved_by', type: 'int', nullable: true })
  approved_by?: number;
}
