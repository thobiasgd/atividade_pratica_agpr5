import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { OrderCreatedEvent } from '@/domain/events/order-created-event';
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification';
import { OrderRepository } from '@/domain/repositories/order-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnOrderCreated implements EventHandler {
  constructor(
    private orderRepository: OrderRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    console.log(
      '[OnOrderCreated] Registrando listener para',
      OrderCreatedEvent.name,
    );

    DomainEvents.register(
      this.sendNewOrderNotification.bind(this),
      OrderCreatedEvent.name,
    );
  }

  private async sendNewOrderNotification(event: OrderCreatedEvent) {
    console.log('[OnOrderCreated] Recebi evento OrderCreatedEvent', {
      orderId: event.order.id.toString(),
      recipientId: event.order.recipientId.toString(),
      description: event.order.description,
    });

    const persistedOrder = await this.orderRepository.findById(
      event.order.id.toString(),
    );

    //console.log('[OnOrderCreated] persistedOrder', persistedOrder);

    if (!persistedOrder) return;

    const result = await this.sendNotification.execute({
      recipientId: persistedOrder.recipientId.toString(),
      title: `Encomenda: "${persistedOrder.description.substring(0, 40)}" - ${persistedOrder.status}`,
      description: persistedOrder.description,
    });

    console.log(
      '[OnOrderCreated] sendNotification result isLeft?',
      result.isLeft(),
    );
  }
}
