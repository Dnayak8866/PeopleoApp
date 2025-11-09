import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class AttendancePercentageQueryDto {
  @IsInt()
  employeeId: number;

  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsInt()
  companyId?: number;
}
