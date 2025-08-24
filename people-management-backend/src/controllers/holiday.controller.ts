import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { HolidayService } from '../services/holiday.service';
import { CreateHolidayDto, UpdateHolidayDto } from '../dto/holiday.dto';
import { ApiBody, ApiTags, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('holidays')
@Controller('holidays')
@ApiBearerAuth('access-token')
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Post()
  @ApiBody({ type: CreateHolidayDto })
  @ApiResponse({ status: 201, description: 'Holiday created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createHolidayDto: CreateHolidayDto) {
    return this.holidayService.create(createHolidayDto);
  }

  @Get()
  @ApiQuery({ name: 'companyId', type: Number, required: true, description: 'Company ID' })
  @ApiResponse({ status: 200, description: 'List all holidays.' })
  @ApiResponse({ status: 404, description: 'Holidays not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  findAll(@Query('companyId') companyId: string) {
    console.log('Company ID in HolidayController:', companyId);
    return this.holidayService.findAll(+companyId);
  }

  @Get('year/:year')
  @ApiQuery({ name: 'companyId', type: Number, required: true, description: 'Company ID' })
  @ApiParam({ name: 'year', type: Number, description: 'Year to filter holidays' })
  @ApiResponse({ status: 200, description: 'List holidays for a specific year.' })
  @ApiResponse({ status: 404, description: 'Holidays not found for the specified year.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  findByYear(
    @Query('companyId') companyId: string,
    @Param('year') year: string,
  ) {
    return this.holidayService.findByYear(+companyId, +year);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Holiday ID' })
  @ApiResponse({ status: 200, description: 'Get holiday by ID.' })
  @ApiResponse({ status: 404, description: 'Holiday not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  findOne(@Param('id') id: string) {
    return this.holidayService.findOne(+id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Holiday ID' })
  @ApiBody({ type: UpdateHolidayDto })
  @ApiResponse({ status: 200, description: 'Holiday updated successfully.' })
  @ApiResponse({ status: 404, description: 'Holiday not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(@Param('id') id: string, @Body() updateHolidayDto: UpdateHolidayDto) {
    return this.holidayService.update(+id, updateHolidayDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Holiday ID' })
  @ApiResponse({ status: 200, description: 'Holiday deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Holiday not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  remove(@Param('id') id: string) {
    return this.holidayService.remove(+id);
  }
}