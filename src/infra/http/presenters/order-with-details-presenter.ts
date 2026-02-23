import { OrderWithDetails } from '@/domain/entities/orderWithDetails';

export class OrderWithDetailsPresenter {
  static toHTTP(order: OrderWithDetails) {
    return {
      description: order.description,
      status: order.status,

      recipientName: order.recipientName,

      completeAddress: {
        id: order.completeAddress.id,
        street: order.completeAddress.street,
        number: order.completeAddress.number,
        neighborhood: order.completeAddress.neighborhood,
        city: order.completeAddress.city,
        state: order.completeAddress.state,
        country: order.completeAddress.country,
        recipientId: order.completeAddress.recipientId,
      },

      carrierName: order.carrierName,
    };
  }
}
