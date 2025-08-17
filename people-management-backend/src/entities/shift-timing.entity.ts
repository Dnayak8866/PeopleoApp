import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('shift_timings')
export class ShiftTiming {
  @PrimaryGeneratedColumn('increment')
  shift_id: number;

  @Column({ name: 'company_id', type: 'int'})
  company_id: number;

  @Column({ length: 100 })
  shift_name: string;

  @Column({ type: 'time' })
  from_time: Date;

  @Column({ type: 'time' })
  to_time: Date;

  @Column({ default: false })
  is_night_shift: boolean;
}
