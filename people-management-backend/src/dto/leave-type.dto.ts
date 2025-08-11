import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeaveTypeDto {
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

export class UpdateLeaveTypeDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Sick Leave', description: 'The name of the leave type', required: false })
  type_name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Leave for health issues', description: 'Description of the leave type', required: false })
  description?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 15, description: 'Updated leave balance for the leave type', required: false })
  leave_balance?: number;
}