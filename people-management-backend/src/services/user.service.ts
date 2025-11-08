import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(UserDto: UserDto): Promise<User> {
    console.log(UserDto);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(UserDto.password, saltRounds);
    console.log('Hashed Password: ', hashedPassword);
    const now = new Date();

    const user = this.userRepository.create({
      companyId: UserDto.company_id,
      departmentId: UserDto.department_id,
      designationId: UserDto.designation_id,
      email: UserDto.email,
      employeeCode: UserDto.employee_code,
      fullName: UserDto.full_name,
      joiningDate: UserDto.joining_date,
      phoneNumber: UserDto.phone_number,
      roleId: UserDto.role_id,
      createdAt: now.toISOString(),
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const employee = await this.userRepository.findOneBy({ id });
    if (!employee) throw new NotFoundException(`User #${id} not found`);
    return employee;  
  }

  async update(id: number, updateEmployeeDto: UserDto): Promise<User> {
    const employee = await this.findOne(id);
    if (!employee) throw new NotFoundException(`User #${id} not found`);
    const updated = Object.assign(employee, updateEmployeeDto);
    return this.userRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.findOne(id);
    if(!employee){
      throw new NotFoundException(`User #${id} not found`);
    }
    employee.isDeleted = true;
    const result = this.userRepository.save(employee);
  }

  async findByPhone(phoneNumber: string): Promise<User | null> {
    console.log("phoneNumber", phoneNumber);
    return await this.userRepository.findOne({ where: { phoneNumber } });
  }
}
