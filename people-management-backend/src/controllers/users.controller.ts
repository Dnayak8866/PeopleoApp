import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUsersDto } from '../dto/create-users.dto';
import { UpdateUsersDto } from '../dto/update-users.dto';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Post()
  create(@Body() dto: CreateUsersDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUsersDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}