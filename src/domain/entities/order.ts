import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { OrderCreatedEvent } from '../events/order-created-event';
import { OrderAssignedToCarrierEvent } from '../events/order-assigned-to-carrier-event';
import { OrderDeliveredEvent } from '../events/order-delivered-event';
import { OrderReturnedEvent } from '../events/order-returned-event';

export type OrderStatus = 'WAITING' | 'ON_THE_WAY' | 'DELIVERED' | 'RETURNED';

export interface OrderProps {
  description: string;
  status: OrderStatus;
  recipientId: UniqueEntityID;
  addressId: UniqueEntityID;
  carrierId: UniqueEntityID | null;
}

export class Order extends AggregateRoot<OrderProps> {
  get description() {
    return this.props.description;
  }

  get status() {
    return this.props.status;
  }

  get recipientId() {
    return this.props.recipientId;
  }

  get addressId() {
    return this.props.addressId;
  }

  get carrierId(): UniqueEntityID | null {
    return this.props.carrierId ?? null;
  }

  set carrierId(carrierId: UniqueEntityID | null) {
    this.props.carrierId = carrierId;
  }

  set status(status: OrderStatus) {
    // evita disparar evento se não houve mudança real
    if (this.props.status === status) return;

    this.props.status = status;

    switch (status) {
      case 'ON_THE_WAY':
        if (this.props.carrierId) {
          this.addDomainEvent(
            new OrderAssignedToCarrierEvent(this, this.props.carrierId),
          );
        }
        break;

      case 'DELIVERED':
        this.addDomainEvent(new OrderDeliveredEvent(this));
        break;

      case 'RETURNED':
        this.addDomainEvent(new OrderReturnedEvent(this));
        break;
    }
  }

  static create(props: OrderProps, id?: UniqueEntityID) {
    const order = new Order(props, id);

    order.addDomainEvent(new OrderCreatedEvent(order));

    return order;
  }
}
