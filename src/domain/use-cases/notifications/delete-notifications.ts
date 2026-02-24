import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';

interface DeleteNotificationUseCaseRequest {
  notificationId: string;
}

type DeleteNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DeleteNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    notificationId,
  }: DeleteNotificationUseCaseRequest): Promise<DeleteNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId);

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    await this.notificationsRepository.delete(notification);

    return right(null);
  }
}
