import { Either, right } from '@/core/either';
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { Notification } from '@/domain/notification/entities/notification';
import { Injectable } from '@nestjs/common';

interface fetchListOfNotificationsUseCaseRequest {
  page: number;
}

type fetchListOfNotificationsResponse = Either<
  null,
  {
    notifications: Notification[];
  }
>;

@Injectable()
export class fetchListOfNotificationsUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    page,
  }: fetchListOfNotificationsUseCaseRequest): Promise<fetchListOfNotificationsResponse> {
    const notifications =
      await this.notificationsRepository.fetchListOfNotifications(page);

    return right({
      notifications,
    });
  }
}
