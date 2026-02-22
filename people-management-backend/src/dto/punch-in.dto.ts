import { IsNumber, IsOptional, IsBoolean, IsDateString, IsString } from 'class-validator';

export class PunchInDto {
  @IsNumber()
  employee_id: number;

  @IsDateString()
  attendance_date: Date;

  @IsOptional()
  @IsNumber()
  punch_in_latitude?: number;

  @IsOptional()
  @IsNumber()
  punch_in_longitude?: number;

  @IsOptional()
  @IsBoolean()
  is_punch_in_from_office?: boolean;

  @IsOptional()
  @IsNumber()
  shift_id?: number;
}
