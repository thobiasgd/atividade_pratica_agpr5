import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { Notification } from '@/domain/notification/entities/notification';
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper';

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async fetchListOfNotifications(page: number): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      take: 20,
      skip: (page - 1) * 20,
    });

    return notifications.map(PrismaNotificationMapper.toDomain);
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id,
      },
    });

    if (!notification) {
      return null;
    }

    return PrismaNotificationMapper.toDomain(notification);
  }

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification);

    await this.prisma.notification.create({
      data,
    });
  }

  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification);

    await this.prisma.notification.update({
      where: {
        id: notification.id.toString(),
      },
      data,
    });
  }

  async delete(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification);

    await this.prisma.notification.deleteMany({
      where: {
        id: data.id,
      },
    });
  }
}
