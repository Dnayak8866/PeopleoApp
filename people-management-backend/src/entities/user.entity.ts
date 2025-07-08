import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  jobTitle: string;

  @Column()
  phone: number;

  @Column({ unique: true })
  email: string;

  @Column()
  gender: string;

  @Column()
  dob: Date;

  @Column()
  joiningDate: Date;

  @Column({foreignKeyConstraintName: 'roleId'})
  roleId: number;

  // New: relation to Role
  @ManyToOne(() => Role, (role) => role.user, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column()
  AddressLine1: string;

  @Column()
  AddressLine2: string;

  @Column()
  City: string;

  @Column()
  State: string;

  @Column()
  Country: string;

  @Column()
  Zipcode: string;

  @Column()
  AadharNumber: string;

  @Column()
  PANNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  isDeleted: Boolean;


}