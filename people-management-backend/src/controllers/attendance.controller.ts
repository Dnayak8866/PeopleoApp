import { Controller, Post, Body, UploadedFiles, UseInterceptors, Param, Get, Query } from '@nestjs/common';
import { AttendanceService } from '../services/attendance.service';
import { AttendanceDto } from '../dto/attendance.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { ApiBody, ApiTags, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AttendancePercentageQueryDto } from '../dto/attendance-percentage-query.dto';
import { MonthlyAttendanceQueryDto } from '../dto/monthly-attendance-query.dto';

@ApiTags('attendance')
@ApiBearerAuth('access-token')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @ApiBody({ type: AttendanceDto, description: 'Attendance data with optional photos' })
  @ApiResponse({ status: 201, description: 'Attendance created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 409, description: 'Conflict: Attendance already marked for this date.' })
  @UseInterceptors(FilesInterceptor('photos'))
  async create(
    @Body() dto: AttendanceDto,
    @UploadedFiles() files: Multer.File[],
  ) {
    // Expect files[0] = punch_in_photo, files[1] = punch_out_photo
    return this.attendanceService.create(dto, files?.[0], files?.[1]);
  }
  @Get('percentage')
  @ApiOperation({ summary: 'Get employee attendance percentage for a month excluding holidays' })
  @ApiQuery({ name: 'employeeId', required: true, description: 'Employee ID' })
  @ApiQuery({ name: 'month', required: true, description: 'Month (1-12) to calculate for' })
  @ApiQuery({ name: 'year', required: false, description: 'Year (defaults to current year)' })
  @ApiQuery({ name: 'companyId', required: false, description: 'Company ID to filter holidays (optional)' })
  @ApiResponse({ status: 200, description: 'Returns attendance percentage excluding holidays' })
  async getEmployeePercentage(@Query() q: AttendancePercentageQueryDto) {
    const year = q.year ?? new Date().getFullYear();
    return this.attendanceService.getEmployeeMonthlyPercentage(q.employeeId, q.month, year, q.companyId);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Attendance ID' })
  @ApiResponse({ status: 200, description: 'Get attendance by ID.' })
  @ApiResponse({ status: 404, description: 'Attendance not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(+id);
  }

  @Get('monthly')
  @ApiQuery({ name: 'month', required: true, type: Number })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'employee_id', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Monthly attendance for employee' })
  async monthly(@Query() query: MonthlyAttendanceQueryDto) {
    console.log("company_id:", query.company_id);
    console.log("employee_id:", query.employee_id);
    console.log("month:", query.month);
    console.log("year:", query.year);
    return this.attendanceService.getMonthlyAttendance(query.employee_id, query.month, query.year, query.company_id);
  }
}