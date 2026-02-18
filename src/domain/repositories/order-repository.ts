import { Order } from '../entities/order';

export abstract class OrderRepository {
  abstract create(order: Order): Promise<void>;
  abstract asignOrderToCarrier(order: Order): Promise<void>;
  abstract changeOrderStatus(order: Order, status: string): Promise<void>;
  abstract listNearOrders(neighborhood: string): Promise<Order[]>;
  abstract findById(orderId: string): Promise<Order | null>;
}
