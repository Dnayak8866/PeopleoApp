import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';

@Entity('companies')
export class Company {
    @PrimaryGeneratedColumn({ name: 'company_id' })
    id: number;

    @Column({ name: 'name', type: 'varchar', length: 255 })
    name: string;

    @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
    email: string;

    @Column({ name: 'contact_number', type: 'varchar', length: 20, nullable: true })
    contactNumber: string;

    @Column({ name: 'address', type: 'text', nullable: true })
    address: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
