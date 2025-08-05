import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn({ name: 'role_id' })
  id: number;

  @Column({ name: 'role_name', type: 'varchar', length: 100 })
  roleName: string;

  @OneToMany(() => User, user => user.role)
  users: User[];
}
