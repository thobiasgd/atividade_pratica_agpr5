import { Order } from '@/domain/entities/order';

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      description: order.description,
      status: order.status,
      recipientId: order.recipientId.toString(),
      addressId: order.addressId.toString(),
      carrierId: order.carrierId?.toString(),
    };
  }
}

/* get description(): string;
    set status(status: OrderStatus);
    get status(): OrderStatus;
    get recipientId(): UniqueEntityID;
    get addressId(): UniqueEntityID;
    set carrierId(carrierId: UniqueEntityID | null);
    get carrierId(): UniqueEntityID | null;
 */
