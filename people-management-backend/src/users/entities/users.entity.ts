import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Roles } from '../../roles/entities/roles.entity';

@Entity()
export class Users {
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
  @ManyToOne(() => Roles, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role: Roles;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  isDeleted: Boolean;

}
