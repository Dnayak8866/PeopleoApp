import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { AttendanceService } from '../services/attendance.service';
import { AttendanceDto } from '../dto/attendance.dto';
import { PunchInDto } from '../dto/punch-in.dto';
import { PunchOutDto } from '../dto/punch-out.dto';
import { ApiBody, ApiTags, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AttendancePercentageQueryDto } from '../dto/attendance-percentage-query.dto';
import { MonthlyAttendanceQueryDto } from '../dto/monthly-attendance-query.dto';

@ApiTags('attendance')
@ApiBearerAuth('access-token')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) { }

  @Post('punch-in')
  @ApiOperation({ summary: 'Record punch in for current session' })
  @ApiBody({ type: PunchInDto })
  @ApiResponse({ status: 201, description: 'Punch in recorded successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 409, description: 'Conflict: Previous session not completed.' })
  async punchIn(@Body() dto: PunchInDto) {
    return this.attendanceService.punchIn(dto);
  }

  @Post('punch-out')
  @ApiOperation({ summary: 'Record punch out for current session' })
  @ApiBody({ type: PunchOutDto })
  @ApiResponse({ status: 200, description: 'Punch out recorded successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'No active punch-in session found.' })
  async punchOut(@Body() dto: PunchOutDto) {
    return this.attendanceService.punchOut(dto);
  }

  @Get('session-status/:employeeId')
  @ApiOperation({ summary: 'Get today punch-in status' })
  @ApiParam({ name: 'employeeId', type: Number })
  @ApiResponse({ status: 200, description: 'Session status retrieved.' })
  async getTodaySessionStatus(@Param('employeeId') employeeId: string) {
    return this.attendanceService.getTodaySessionStatus(+employeeId);
  }

  @Get('daily-summary')
  @ApiOperation({ summary: 'Get daily attendance summary for a company (present, absent, on-leave, late, avg hours)' })
  @ApiQuery({ name: 'date', required: true, description: 'Date in YYYY-MM-DD format' })
  @ApiQuery({ name: 'company_id', required: true, description: 'Company ID' })
  @ApiResponse({ status: 200, description: 'Daily summary returned.' })
  async getDailySummary(
    @Query('date') date: string,
    @Query('company_id') companyId: string,
  ) {
    return this.attendanceService.getDailySummary(date, +companyId);
  }

  @Get('by-date')
  @ApiOperation({ summary: 'Get all employee attendance records for a specific date and company' })
  @ApiQuery({ name: 'date', required: true, description: 'Date in YYYY-MM-DD format' })
  @ApiQuery({ name: 'company_id', required: true, description: 'Company ID' })
  @ApiResponse({ status: 200, description: 'Employee attendance list returned.' })
  async getAttendanceByDate(
    @Query('date') date: string,
    @Query('company_id') companyId: string,
  ) {
    return this.attendanceService.getAttendanceByDate(date, +companyId);
  }

  @Get('percentage')
  @ApiOperation({ summary: 'Get employee attendance percentage for a month excluding holidays and weekends' })
  @ApiQuery({ name: 'employeeId', required: true, description: 'Employee ID' })
  @ApiQuery({ name: 'month', required: true, description: 'Month (1-12)' })
  @ApiQuery({ name: 'year', required: false, description: 'Year (defaults to current year)' })
  @ApiQuery({ name: 'companyId', required: false, description: 'Company ID to filter holidays' })
  @ApiResponse({ status: 200, description: 'Returns attendance percentage excluding holidays and weekends' })
  async getEmployeePercentage(@Query() q: AttendancePercentageQueryDto) {
    const year = q.year ?? new Date().getFullYear();
    return this.attendanceService.getEmployeeMonthlyPercentage(q.employeeId, q.month, year, q.companyId);
  }

  @Get('employee-stats')
  @ApiOperation({ summary: 'Get detailed attendance stats for an employee for a month' })
  @ApiQuery({ name: 'employeeId', required: true })
  @ApiQuery({ name: 'month', required: true })
  @ApiQuery({ name: 'year', required: true })
  @ApiResponse({ status: 200, description: 'Stats returned.' })
  async getEmployeeStats(
    @Query('employeeId') employeeId: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.attendanceService.getEmployeeStats(+employeeId, +month, +year);
  }

  @Get('company-stats')
  @ApiOperation({ summary: 'Get monthly attendance stats for a company' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'month', required: true })
  @ApiQuery({ name: 'year', required: true })
  @ApiResponse({ status: 200, description: 'Stats returned.' })
  async getCompanyStats(
    @Query('companyId') companyId: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.attendanceService.getCompanyMonthlyStats(+companyId, +month, +year);
  }

  // @Get(':id')
  // @ApiParam({ name: 'id', type: Number, description: 'Attendance ID' })
  // @ApiResponse({ status: 200, description: 'Get attendance by ID.' })
  // @ApiResponse({ status: 404, description: 'Attendance not found.' })
  // @ApiResponse({ status: 400, description: 'Bad Request.' })
  // @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  // async findOne(@Param('id') id: string) {
  //   return this.attendanceService.findOne(+id);
  // }

  // @Get('monthly')
  // @ApiQuery({ name: 'month', required: true, type: Number })
  // @ApiQuery({ name: 'year', required: true, type: Number })
  // @ApiQuery({ name: 'employee_id', required: true, type: Number })
  // @ApiResponse({ status: 200, description: 'Monthly attendance for employee' })
  // async monthly(@Query() query: MonthlyAttendanceQueryDto) {
  //   console.log("company_id:", query.company_id);
  //   console.log("employee_id:", query.employee_id);
  //   console.log("month:", query.month);
  //   console.log("year:", query.year);
  //   return this.attendanceService.getMonthlyAttendance(query.employee_id, query.month, query.year, query.company_id);
  // }
}