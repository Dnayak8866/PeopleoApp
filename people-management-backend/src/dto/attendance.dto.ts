import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class AttendanceDto {
  @IsNumber()
  employee_id: number;

  @IsOptional()
  @IsDateString()
  punch_in?: Date;

  @IsOptional()
  @IsDateString()
  punch_out?: Date;

  @IsOptional()
  @IsNumber()
  punch_in_latitude?: number;

  @IsOptional()
  @IsNumber()
  punch_in_longitude?: number;

  @IsOptional()
  @IsNumber()
  punch_out_latitude?: number;

  @IsOptional()
  @IsNumber()
  punch_out_longitude?: number;

  @IsOptional()
  @IsNumber()
  shift_id?: number;

  @IsDateString()
  attendance_date: Date;

  @IsOptional()
  @IsString()
  status?: string;
}