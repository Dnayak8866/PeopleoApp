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

export class ShiftTimingDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 1, description: 'The company ID' })
  company_id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Morning Shift', description: 'The name of the shift' })
  shift_name: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ example: '08:00:00', description: 'Shift start time' })
  from_time: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ example: '17:00:00', description: 'Shift end time' })
  to_time: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false, description: 'Is this a night shift?', required: false })
  is_night_shift?: boolean;
}