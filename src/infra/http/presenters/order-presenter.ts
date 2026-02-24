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
