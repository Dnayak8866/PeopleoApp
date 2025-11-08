import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('designations')
export class Designation {
  @PrimaryGeneratedColumn('increment')
  designation_id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'company_id', type: 'int' })
  company_id: number;
}