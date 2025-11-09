import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';

export class LeaveTypeDto {
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'The company ID' })
  company_id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Annual Leave', description: 'The name of the leave type' })
  type_name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Leave for personal reasons', description: 'Description of the leave type', required: false })
  description?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 10, description: 'Leave balance for the leave type', required: false })
  leave_balance?: number;
}