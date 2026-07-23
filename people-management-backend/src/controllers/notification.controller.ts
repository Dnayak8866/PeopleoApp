import { Controller, Get, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':employeeId')
  @ApiOperation({ summary: 'Get all notifications for an employee' })
  @ApiParam({ name: 'employeeId', type: Number })
  @ApiResponse({ status: 200, description: 'List of notifications returned.' })
  async getNotifications(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.notificationService.findAllForUser(employeeId);
  }

  @Patch(':employeeId/read-all')
  @ApiOperation({ summary: 'Mark all notifications as read for an employee' })
  @ApiParam({ name: 'employeeId', type: Number })
  @ApiResponse({ status: 200, description: 'All notifications marked as read.' })
  async readAll(@Param('employeeId', ParseIntPipe) employeeId: number) {
    await this.notificationService.markAllRead(employeeId);
    return { success: true };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a specific notification as read' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Notification marked as read.' })
  async readNotification(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.markRead(id);
  }
}
