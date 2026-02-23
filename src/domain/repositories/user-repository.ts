import { Order } from '../entities/order';
import { User } from '../entities/user';

export abstract class UsersRepository {
  abstract findByCpf(cpf: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract fetchUserOrders(userId: string): Promise<Order[]>;
  abstract fetchListOfUsers(page: number): Promise<User[]>;
  abstract alterUserPassword(user: User): Promise<void>;
  abstract create(user: User): Promise<void>;
  abstract delete(user: User): Promise<void>;
  abstract save(user: User): Promise<void>;
}
