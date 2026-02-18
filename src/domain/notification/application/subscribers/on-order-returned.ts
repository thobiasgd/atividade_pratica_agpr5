import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { OrderReturnedEvent } from '@/domain/events/order-returned-event';
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification';
import { OrderRepository } from '@/domain/repositories/order-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnOrderReturned implements EventHandler {
  constructor(
    private orderRepository: OrderRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendReturnedNotification.bind(this),
      OrderReturnedEvent.name,
    );
  }

  private async sendReturnedNotification(event: OrderReturnedEvent) {
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
