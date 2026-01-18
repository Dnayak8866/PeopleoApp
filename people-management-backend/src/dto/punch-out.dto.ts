import { IsNumber, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class PunchOutDto {
  @IsNumber()
  employee_id: number;

  @IsDateString()
  attendance_date: Date;

  @IsOptional()
  @IsNumber()
  punch_out_latitude?: number;

  @IsOptional()
  @IsNumber()
  punch_out_longitude?: number;

  @IsOptional()
  @IsBoolean()
  is_punch_out_from_office?: boolean;
}
