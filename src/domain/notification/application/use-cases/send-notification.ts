import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Either, right } from '@/core/either';
import { NotificationsRepository } from '../repositories/notifications-repository';
import { Injectable } from '@nestjs/common';
import { Notification } from '../../entities/notification';

export interface SendNotificationUseCaseRequest {
  recipientId: string;
  title: string;
  description: string;
}

export type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification;
  }
>;

@Injectable()
export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    title,
    description,
  }: SendNotificationUseCaseRequest) {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
      description,
    });

    await this.notificationsRepository.create(notification);

    return right({ notification });
  }
}
