import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { LeaveType } from './leave-type.entity';

@Entity('leave_balances')
export class LeaveBalance {
    @PrimaryGeneratedColumn({ name: 'balance_id' })
    balance_id: number;

    @Column({ name: 'employee_id' })
    employee_id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'employee_id' })
    employee: User;

    @Column({ name: 'leave_type_id' })
    leave_type_id: number;

    @ManyToOne(() => LeaveType)
    @JoinColumn({ name: 'leave_type_id' })
    leave_type: LeaveType;

    @Column({ name: 'year' })
    year: number;

    @Column({ name: 'balance', type: 'decimal', precision: 5, scale: 2, default: 0 })
    balance: number;

    @Column({ name: 'carried_forward', type: 'decimal', precision: 5, scale: 2, default: 0 })
    carried_forward: number;
}
