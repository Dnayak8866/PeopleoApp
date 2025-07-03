import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import { CreateUsersDto } from '../dto/create-users.dto';
import { UpdateUsersDto } from '../dto/update-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async create(createUsersDto: CreateUsersDto): Promise<Users> {
    const employee = this.userRepository.create(createUsersDto);
    return this.userRepository.save(employee);
  }

  findAll(): Promise<Users[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<Users> {
    const employee = await this.userRepository.findOneBy({ id });
    if (!employee) throw new NotFoundException(`Users #${id} not found`);
    return employee;  
  }

  async update(id: number, updateEmployeeDto: UpdateUsersDto): Promise<Users> {
    const employee = await this.findOne(id);
    const updated = Object.assign(employee, updateEmployeeDto);
    return this.userRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.findOne(id);
    employee.isDeleted = true;
    const result = this.userRepository.save(employee);
    if(!employee){
      throw new NotFoundException(`Users #${id} not found`);
    }
    // const result = await this.userRepository.delete(id);
    // if (result.affected === 0) {
    //   throw new NotFoundException(`Users #${id} not found`);
    // }
  }
}
