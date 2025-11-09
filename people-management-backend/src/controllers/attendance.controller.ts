import { Controller, Post, Body, UploadedFiles, UseInterceptors, Param, Get } from '@nestjs/common';
import { AttendanceService } from '../services/attendance.service';
import { AttendanceDto } from '../dto/attendance.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { ApiBody, ApiTags, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

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

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Attendance ID' })
  @ApiResponse({ status: 200, description: 'Get attendance by ID.' })
  @ApiResponse({ status: 404, description: 'Attendance not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(+id);
  }
}