import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('leave_types')
export class LeaveType {
  @PrimaryGeneratedColumn('increment')
  leave_type_id: number;

  @Column({ name: 'company_id', type: 'int' })
  company_id: number;

  @Column({ length: 100 })
  type_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  leave_balance: number;
}
