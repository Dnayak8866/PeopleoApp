import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { LeaveTypeService } from '../services/leave-type.service';
import { LeaveTypeDto } from '../dto/leave-type.dto';
import { ApiBody, ApiTags, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('leave-types')
@Controller('leave-types')
@ApiBearerAuth('access-token')
export class LeaveTypeController {
  constructor(private readonly leaveTypeService: LeaveTypeService) {}

  @Post()
  @ApiBody({ type: LeaveTypeDto })
  @ApiResponse({ status: 201, description: 'Leave type created successfully.' })
  create(@Body() LeaveTypeDto: LeaveTypeDto) {
    return this.leaveTypeService.create(LeaveTypeDto);
  }

  @Get()
  @ApiQuery({ name: 'companyId', type: Number, required: true, description: 'Company ID' })
  @ApiResponse({ status: 200, description: 'List all leave types.' })
  findAll(@Query('companyId') companyId: string) {
    return this.leaveTypeService.findAll(+companyId);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Leave Type ID' })
  @ApiResponse({ status: 200, description: 'Get leave type by ID.' })
  @ApiResponse({ status: 404, description: 'Leave type not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  findOne(@Param('id') id: string) {
    return this.leaveTypeService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() LeaveTypeDto: LeaveTypeDto) {
    return this.leaveTypeService.update(+id, LeaveTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaveTypeService.remove(+id);
  }
}
