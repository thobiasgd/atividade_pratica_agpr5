import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { OrderDeliveredEvent } from '@/domain/events/order-delivered-event';
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification';
import { OrderRepository } from '@/domain/repositories/order-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnOrderDelivered implements EventHandler {
  constructor(
    private orderRepository: OrderRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendDeliveredNotification.bind(this),
      OrderDeliveredEvent.name,
    );
  }

  private async sendDeliveredNotification(event: OrderDeliveredEvent) {
    const persistedOrder = await this.orderRepository.findById(
      event.order.id.toString(),
    );
    if (!persistedOrder) return;

    await this.sendNotification.execute({
      recipientId: persistedOrder.recipientId.toString(),
      title: `Encomenda: "${persistedOrder.description.substring(0, 40)}" - ${persistedOrder.status}`,
      description: persistedOrder.description,
    });
  }
}
