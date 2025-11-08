import { Controller, Get, Query } from '@nestjs/common';
import { SalaryCountdownService } from '../services/salary-countdown.service';
import { SalaryCountdownQueryDto } from '../dto/salary-countdown-query.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Salary Countdown')
@Controller('salary-countdown')
export class SalaryCountdownController {
  constructor(private readonly svc: SalaryCountdownService) {}

  @Get()
  @ApiOperation({ summary: 'Get days remaining until next salary date' })
  @ApiQuery({ name: 'salaryDay', required: false, description: 'Day of month salary is paid (1-31). Defaults to 1.' })
  @ApiQuery({ name: 'timezone', required: false, description: 'Optional timezone (not yet applied).' })
  @ApiResponse({ status: 200, description: 'Days remaining returned.' })
  get(@Query() query: SalaryCountdownQueryDto) {
    const salaryDay = query.salaryDay ?? 1;
    return this.svc.getCountdown(salaryDay);
  }
}
