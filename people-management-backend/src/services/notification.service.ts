import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async create(employeeId: number, title: string, message: string, type: string = 'info'): Promise<Notification> {
    const notification = this.notificationRepo.create({
      employeeId,
      title,
      message,
      type,
    });
    return this.notificationRepo.save(notification);
  }

  async findAllForUser(employeeId: number): Promise<Notification[]> {
    return this.notificationRepo.find({
      where: { employeeId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAllRead(employeeId: number): Promise<void> {
    await this.notificationRepo.update({ employeeId, isRead: false }, { isRead: true });
  }

  async markRead(id: number): Promise<Notification> {
    const notification = await this.notificationRepo.findOneBy({ id });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    notification.isRead = true;
    return this.notificationRepo.save(notification);
  }
}
