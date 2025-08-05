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

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber(undefined)
  phone_number?: string;

  @IsOptional()
  @IsString()
  employee_code?: string;

  @IsOptional()
  @IsDateString()
  joining_date?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsNotEmpty()
  @IsInt()
  company_id: number;

  @IsNotEmpty()
  @IsInt()
  role_id: number;

  @IsOptional()
  @IsInt()
  department_id?: number;

  @IsOptional()
  @IsInt()
  designation_id?: number;

  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  password: string;
}
