import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ShiftTimingService } from '../services/shift-timing.service';
import { CreateShiftTimingDto, UpdateShiftTimingDto } from '../dto/shift-timing.dto';
import { ApiBody, ApiTags, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('shift-timings')
@Controller('shift-timings')
export class ShiftTimingController {
  constructor(private readonly shiftTimingService: ShiftTimingService) {}

  @Post()
  create(@Body() createShiftTimingDto: CreateShiftTimingDto) {
    return this.shiftTimingService.create(createShiftTimingDto);
  }

  @Get()
  findAll(@Query('companyId') companyId: string) {
    return this.shiftTimingService.findAll(+companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shiftTimingService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateShiftTimingDto: UpdateShiftTimingDto) {
    return this.shiftTimingService.update(+id, updateShiftTimingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shiftTimingService.remove(+id);
  }
}
