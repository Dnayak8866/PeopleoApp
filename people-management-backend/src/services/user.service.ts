import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const employee = this.userRepository.create(createUserDto);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.pass, saltRounds);

    const user = this.userRepository.create({
      ...createUserDto,
      pass: hashedPassword, // Store hashed password
    });
    return this.userRepository.save(employee);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const employee = await this.userRepository.findOneBy({ id });
    if (!employee) throw new NotFoundException(`User #${id} not found`);
    return employee;  
  }

  async update(id: number, updateEmployeeDto: UpdateUserDto): Promise<User> {
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

  async findByPhone(phone: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { phone } });
  }
}
