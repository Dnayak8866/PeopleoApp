import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('employees')
export class User {
  @PrimaryGeneratedColumn({ name: 'employee_id' })
  id: number;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true, nullable: true })
  email: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: true })
  phoneNumber: string;

  @Column({ name: 'employee_code', type: 'varchar', length: 100, unique: true, nullable: true })
  employeeCode: string;

  @Column({ name: 'joining_date', type: 'date', nullable: true })
  joiningDate: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'company_id', type: 'int' })
  companyId: number;

  @Column({ name: 'department_id', type: 'int', nullable: true })
  departmentId: number;

  @Column({ name: 'designation_id', type: 'int', nullable: true })
  designationId: number;

  @Column({ name: 'role_id', type: 'int' })
  roleId: number;

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  // @Column({ type: 'varchar', select: false }) // Exclude password from default queries
  // password: string;

  @Column({ type: 'varchar', select: true }) // Exclude password from default queries
  password: string;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;
}
