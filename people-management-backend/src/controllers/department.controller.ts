import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { DepartmentService } from '../services/department.service';
import { DepartmentDto } from '../dto/department.dto';
import { ApiBody, ApiTags, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('departments')
@Controller('departments')
@ApiBearerAuth('access-token')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @ApiBody({ type: DepartmentDto })
  @ApiResponse({ status: 201, description: 'Department created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() DepartmentDto: DepartmentDto) {
    return this.departmentService.create(DepartmentDto);
  }

  @Get()
  @ApiQuery({ name: 'companyId', type: Number, required: true, description: 'Company ID' })
  @ApiResponse({ status: 200, description: 'List all departments.' })
  @ApiResponse({ status: 404, description: 'Departments not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  findAll(@Query('companyId') companyId: string) {
    return this.departmentService.findAll(+companyId);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Department ID' })
  @ApiResponse({ status: 200, description: 'Get department by ID.' })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(+id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Department ID' })
  @ApiBody({ type: DepartmentDto })
  @ApiResponse({ status: 200, description: 'Department updated successfully.' })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(@Param('id') id: string, @Body() DepartmentDto: DepartmentDto) {
    return this.departmentService.update(+id, DepartmentDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Department ID' })
  @ApiResponse({ status: 200, description: 'Department deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  remove(@Param('id') id: string) {
    return this.departmentService.remove(+id);
  }
}