import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { LeaveTypeService } from '../services/leave-type.service';
import { CreateLeaveTypeDto, UpdateLeaveTypeDto } from '../dto/leave-type.dto';
import { ApiBody, ApiTags, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('leave-types')
@Controller('leave-types')
export class LeaveTypeController {
  constructor(private readonly leaveTypeService: LeaveTypeService) {}

  @Post()
  @ApiBody({ type: CreateLeaveTypeDto })
  @ApiResponse({ status: 201, description: 'Leave type created successfully.' })
  create(@Body() createLeaveTypeDto: CreateLeaveTypeDto) {
    return this.leaveTypeService.create(createLeaveTypeDto);
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
  update(@Param('id') id: string, @Body() updateLeaveTypeDto: UpdateLeaveTypeDto) {
    return this.leaveTypeService.update(+id, updateLeaveTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaveTypeService.remove(+id);
  }
}
