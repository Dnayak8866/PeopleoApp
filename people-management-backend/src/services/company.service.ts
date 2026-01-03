import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
    ) { }

    async findOne(id: number): Promise<Company> {
        const company = await this.companyRepository.findOneBy({ id });
        if (!company) {
            throw new NotFoundException(`Company #${id} not found`);
        }
        return company;
    }

    async findAll(): Promise<Company[]> {
        return this.companyRepository.find();
    }
}
