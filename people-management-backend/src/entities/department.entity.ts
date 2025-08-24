import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn('increment')
  department_id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'company_id', type: 'int' })
  company_id: number;
}