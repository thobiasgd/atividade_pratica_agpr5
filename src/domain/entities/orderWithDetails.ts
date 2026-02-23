import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Address } from '@prisma/client';

export type OrderWithDetailsStatus =
  | 'WAITING'
  | 'ON_THE_WAY'
  | 'DELIVERED'
  | 'RETURNED';

export interface OrderWithDetailsProps {
  description: string;
  status: OrderWithDetailsStatus;
  recipientName: string;
  completeAddress: Address;
  carrierName: string | null;
}

export class OrderWithDetails extends AggregateRoot<OrderWithDetailsProps> {
  get description() {
    return this.props.description;
  }

  get status() {
    return this.props.status;
  }

  get recipientName() {
    return this.props.recipientName;
  }

  get completeAddress() {
    return this.props.completeAddress;
  }

  get carrierName(): string | null {
    return this.props.carrierName ?? null;
  }

  static create(props: OrderWithDetailsProps, id?: UniqueEntityID) {
    const order = new OrderWithDetails(props, id);

    //order.addDomainEvent(new OrderCreatedEvent(order));

    return order;
  }
}
