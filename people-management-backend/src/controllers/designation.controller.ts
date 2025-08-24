import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { DesignationService } from '../services/designation.service';
import { CreateDesignationDto, UpdateDesignationDto } from '../dto/designation.dto';
import { ApiBody, ApiTags, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('designations')
@Controller('designations')
@ApiBearerAuth('access-token')
export class DesignationController {
  constructor(private readonly designationService: DesignationService) {}

  @Post()
  @ApiBody({ type: CreateDesignationDto })
  @ApiResponse({ status: 201, description: 'Designation created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Designation not found.' })
  create(@Body() createDesignationDto: CreateDesignationDto) {
    return this.designationService.create(createDesignationDto);
  }

  @Get()
  @ApiQuery({ name: 'companyId', type: Number, required: true, description: 'Company ID' })
  @ApiResponse({ status: 200, description: 'List all designations.' })
  @ApiResponse({ status: 404, description: 'Designations not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  findAll(@Query('companyId') companyId: string) {
    return this.designationService.findAll(+companyId);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Designation ID' })
  @ApiResponse({ status: 200, description: 'Get designation by ID.' })
  @ApiResponse({ status: 404, description: 'Designation not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  findOne(@Param('id') id: string) {
    return this.designationService.findOne(+id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Designation ID' })
  @ApiBody({ type: UpdateDesignationDto })
  @ApiResponse({ status: 200, description: 'Designation updated successfully.' })
  @ApiResponse({ status: 404, description: 'Designation not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(@Param('id') id: string, @Body() updateDesignationDto: UpdateDesignationDto) {
    return this.designationService.update(+id, updateDesignationDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Designation ID' })
  @ApiResponse({ status: 200, description: 'Designation deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Designation not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  remove(@Param('id') id: string) {
    return this.designationService.remove(+id);
  }
}