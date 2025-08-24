import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsInt
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';

export class CreateHolidayDto {
    @IsNotEmpty()
    @IsInt()
    @ApiProperty({ example: 1, description: 'The company ID' })
    company_id: number;

    @IsNotEmpty()
    @IsDateString()
    @ApiProperty({ example: '2023-12-25', description: 'The date of the holiday' })
    holiday_date: Date;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Christmas Day', description: 'The name of the holiday' })
    name: string;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({ example: false, description: 'Is this a optional holiday?', required: false })
    is_optional?: boolean;
}

export class UpdateHolidayDto extends PartialType(CreateHolidayDto) {}