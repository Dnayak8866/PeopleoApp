import { IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MonthlyAttendanceQueryDto {
  @ApiProperty({ example: 5, description: 'Month number (1-12)' })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ example: 2025, description: 'Year e.g. 2025' })
  @IsInt()
  @Min(1970)
  year: number;

  @ApiProperty({ example: 1, description: 'Employee ID' })
  @IsInt()
  employee_id: number;

  @ApiProperty({ required: false, example: 1, description: 'Optional Company id' })
  @IsOptional()
  @IsInt()
  company_id?: number;
}
