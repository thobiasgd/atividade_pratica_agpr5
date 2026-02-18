import { Order } from '../entities/order';
import { User } from '../entities/user';

export abstract class UsersRepository {
  abstract findByCpf(cpf: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract fetchUserOrders(userId: string): Promise<Order[]>;
  abstract alterUserPassword(user: User): Promise<void>;
  abstract create(user: User): Promise<void>;
}
