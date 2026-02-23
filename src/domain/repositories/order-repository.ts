import { Order } from '../entities/order';
import { OrderWithDetails } from '../entities/orderWithDetails';

export abstract class OrderRepository {
  abstract create(order: Order): Promise<void>;
  abstract asignOrderToCarrier(order: Order): Promise<void>;
  abstract changeOrderStatus(order: Order, status: string): Promise<void>;
  abstract listNearOrders(neighborhood: string): Promise<Order[]>;
  abstract fetchListOfOrders(page: number): Promise<OrderWithDetails[]>;
  abstract findById(orderId: string): Promise<Order | null>;
  abstract save(order: Order): Promise<void>;
  abstract delete(order: Order): Promise<void>;
}
