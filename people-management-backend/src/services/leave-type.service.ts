import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveType } from '../entities/leave-type.entity';
import { CreateLeaveTypeDto, UpdateLeaveTypeDto } from '../dto/leave-type.dto';

@Injectable()
export class LeaveTypeService {
  constructor(
    @InjectRepository(LeaveType)
    private leaveTypeRepository: Repository<LeaveType>,
  ) {}

  async create(createLeaveTypeDto: CreateLeaveTypeDto): Promise<LeaveType> {
    const leaveType = this.leaveTypeRepository.create(createLeaveTypeDto);
    return await this.leaveTypeRepository.save(leaveType);
  }

  async findAll(companyId: number): Promise<LeaveType[]> {
    return await this.leaveTypeRepository.find({
      where: { company_id: companyId },
    });
  }

  async findOne(id: number): Promise<LeaveType> {
    const leaveType = await this.leaveTypeRepository.findOne({
      where: { leave_type_id: id },
    });
    if (!leaveType) {
      throw new NotFoundException('Leave type not found');
    }
    return leaveType;
  }

  async update(id: number, updateLeaveTypeDto: UpdateLeaveTypeDto): Promise<LeaveType> {
    await this.findOne(id);
    await this.leaveTypeRepository.update(id, updateLeaveTypeDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const leaveType = await this.findOne(id);
    await this.leaveTypeRepository.remove(leaveType);
  }
}
