import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Holiday } from '../entities/holiday.entity';
import { HolidayDto } from '../dto/holiday.dto';

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(Holiday)
    private holidayRepository: Repository<Holiday>,
  ) {}

  async create(HolidayDto: HolidayDto): Promise<Holiday> {
    const holiday = this.holidayRepository.create(HolidayDto);
    return await this.holidayRepository.save(holiday);
  }

  async findAll(companyId: number): Promise<Holiday[]> {
    return await this.holidayRepository.find({
      where: { company_id: companyId },
      order: { holiday_date: 'ASC' },
    });
  }

  async findByYear(companyId: number, year: number): Promise<Holiday[]> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    return await this.holidayRepository.find({
      where: {
        company_id: companyId,
        holiday_date: Between(startDate, endDate),
      },
      order: { holiday_date: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Holiday> {
    const holiday = await this.holidayRepository.findOne({
      where: { holiday_id: id },
    });
    if (!holiday) {
      throw new NotFoundException('Holiday not found');
    }
    return holiday;
  }

  async update(id: number, HolidayDto: HolidayDto): Promise<Holiday> {
    await this.findOne(id);
    await this.holidayRepository.update(id, HolidayDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const holiday = await this.findOne(id);
    await this.holidayRepository.remove(holiday);
  }
}