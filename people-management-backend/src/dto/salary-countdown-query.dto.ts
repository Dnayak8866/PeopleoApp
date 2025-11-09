import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class SalaryCountdownQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  salaryDay?: number;

  @IsOptional()
  @IsString()
  // Timezone is accepted for future use; current implementation uses server timezone.
  timezone?: string;
}
