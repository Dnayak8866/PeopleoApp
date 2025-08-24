import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('holidays')
export class Holiday {
  @PrimaryGeneratedColumn('increment')
  holiday_id: number;

  @Column({ name: 'company_id', type: 'int' })
  company_id: number;

  @Column({ type: 'date' })
  holiday_date: Date;

  @Column({ length: 255 })
  name: string;

  @Column({ default: false })
  is_optional: boolean;
}