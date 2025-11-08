import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DepartmentDto {

  @IsNotEmpty()
  @ApiProperty({ example: 'Human Resources', description: 'The name of the department' })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'The company ID' })
  company_id: number;
}