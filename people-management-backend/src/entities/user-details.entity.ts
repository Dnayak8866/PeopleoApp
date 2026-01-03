import {
    Entity,
    Column,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('employee_details')
export class UserDetails {
    @PrimaryColumn({ name: 'employee_id' })
    employeeId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'employee_id' })
    employee: User;

    @Column({ name: 'profile_image', type: 'varchar', length: 255, nullable: true })
    profileImage: string;

    @Column({ name: 'house_no', type: 'varchar', length: 50, nullable: true })
    houseNo: string;

    @Column({ name: 'landmark', type: 'varchar', length: 50, nullable: true })
    landmark: string;

    @Column({ name: 'zip_code', type: 'varchar', length: 20, nullable: true })
    zipCode: string;

    @Column({ name: 'city', type: 'varchar', length: 50, nullable: true })
    city: string;

    @Column({ name: 'state', type: 'varchar', length: 50, nullable: true })
    state: string;

    @Column({ name: 'country', type: 'varchar', length: 50, nullable: true })
    country: string;

    @Column({ name: 'aadhar_no', type: 'varchar', length: 20, nullable: true })
    aadharNo: string;

    @Column({ name: 'pan_no', type: 'varchar', length: 20, nullable: true })
    panNo: string;
}