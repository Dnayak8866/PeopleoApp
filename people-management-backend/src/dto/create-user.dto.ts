import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsInt,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
   @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  full_name: string;

  @IsOptional()
  @IsEmail()
   @ApiProperty({ example: 'abs@gmail.com', description: 'The email id of the user' })
  email?: string;

  @IsOptional()
  @IsPhoneNumber(undefined)
  @ApiProperty({ example: '+1234567890', description: 'The phone number of the user', required: false })
  phone_number?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'EMP001', description: 'The employee code', required: false })
  employee_code?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2023-01-01', description: 'The joining date', required: false })
  joining_date?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true, description: 'Is the user active?', required: false })
  is_active?: boolean;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 1, description: 'The company ID' })
  company_id: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 2, description: 'The role ID' })
  role_id: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 3, description: 'The department ID', required: false })
  department_id?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 4, description: 'The designation ID', required: false })
  designation_id?: number;

  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  @ApiProperty({ example: 'password123', description: 'The password for the user' })
  password: string;
}
