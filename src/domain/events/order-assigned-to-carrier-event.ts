import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Order } from '../entities/order';

export class OrderAssignedToCarrierEvent implements DomainEvent {
  public ocurredAt: Date;
  public order: Order;
  public carrierId: UniqueEntityID;

  constructor(order: Order, carrierId: UniqueEntityID) {
    this.order = order;
    this.carrierId = carrierId;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.order.id;
  }
}
