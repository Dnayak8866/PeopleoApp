import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';

export class CreateDesignationDto {

  @IsNotEmpty()
  @ApiProperty({ example: 'Software Engineer', description: 'The name of the designation' })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'The company ID' })
  company_id: number;
}

export class UpdateDesignationDto extends PartialType(CreateDesignationDto) {}