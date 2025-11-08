import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShiftTiming } from '../entities/shift-timing.entity';
import { ShiftTimingDto } from '../dto/shift-timing.dto';

@Injectable()
export class ShiftTimingService {
  constructor(
    @InjectRepository(ShiftTiming)
    private shiftTimingRepository: Repository<ShiftTiming>,
  ) {}

  async create(ShiftTimingDto: ShiftTimingDto): Promise<ShiftTiming> {
    const shiftTiming = this.shiftTimingRepository.create(ShiftTimingDto);
    return await this.shiftTimingRepository.save(shiftTiming);
  }

  async findAll(companyId: number): Promise<ShiftTiming[]> {
    return await this.shiftTimingRepository.find({
      where: { company_id: companyId },
    });
  }

  async findOne(id: number): Promise<ShiftTiming> {
    const shiftTiming = await this.shiftTimingRepository.findOne({
      where: { shift_id: id },
    });
    if (!shiftTiming) {
      throw new NotFoundException('Shift timing not found');
    }
    return shiftTiming;
  }

  async update(id: number, ShiftTimingDto: ShiftTimingDto): Promise<ShiftTiming> {
    const shiftTiming = await this.findOne(id);
    await this.shiftTimingRepository.update(id, ShiftTimingDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const shiftTiming = await this.findOne(id);
    await this.shiftTimingRepository.remove(shiftTiming);
  }
}
