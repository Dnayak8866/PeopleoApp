import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Designation } from '../entities/designation.entity';
import { CreateDesignationDto, UpdateDesignationDto } from '../dto/designation.dto';

@Injectable()
export class DesignationService {
  constructor(
    @InjectRepository(Designation)
    private designationRepository: Repository<Designation>,
  ) {}

  async create(createDesignationDto: CreateDesignationDto): Promise<Designation> {
    const designation = this.designationRepository.create(createDesignationDto);
    return await this.designationRepository.save(designation);
  }

  async findAll(companyId: number): Promise<Designation[]> {
    return await this.designationRepository.find({
      where: {company_id: companyId },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Designation> {
    const designation = await this.designationRepository.findOne({
      where: { designation_id: id },
    });
    
    if (!designation) {
      throw new NotFoundException('Designation not found');
    }
    return designation;
  }

  async update(id: number, updateDesignationDto: UpdateDesignationDto): Promise<Designation> {
    await this.findOne(id);
    await this.designationRepository.update(id, updateDesignationDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const designation = await this.findOne(id);
    await this.designationRepository.remove(designation);
  }
}