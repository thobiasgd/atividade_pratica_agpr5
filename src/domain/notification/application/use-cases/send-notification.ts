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
    console.log('[SendNotification] Criando notificação:', {
      recipientId,
      title,
    });

    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
      description,
    });

    await this.notificationsRepository.create(notification);

    console.log(
      '[SendNotification] Notificação salva:',
      notification.id.toString(),
    );

    return right({ notification });
  }
}
