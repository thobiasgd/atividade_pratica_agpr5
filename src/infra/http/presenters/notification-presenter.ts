import { Notification } from '@/domain/notification/entities/notification';

export class NotificationPresenter {
  static toHTTP(notification: Notification) {
    return {
      title: notification.title,
      description: notification.description,
      readAt: notification.readAt,
    };
  }
}
