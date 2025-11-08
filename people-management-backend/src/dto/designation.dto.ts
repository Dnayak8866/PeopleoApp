import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DesignationDto {

  @IsNotEmpty()
  @ApiProperty({ example: 'Software Engineer', description: 'The name of the designation' })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'The company ID' })
  company_id: number;
}