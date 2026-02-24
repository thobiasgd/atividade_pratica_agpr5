import { BadRequestException, Controller, Get } from '@nestjs/common';
import { OrderPresenter } from '../../presenters/order-presenter';
import { FetchUserOrdersUseCase } from '@/domain/use-cases/orders/fetch-user-orders';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders')
export class FetchUserOrdersController {
  constructor(private fetchUserOrders: FetchUserOrdersUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Rota para listagem de todas as encomendas do usuário atual.',
  })
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.fetchUserOrders.execute({
      userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const orders = result.value.orders;

    return { orders: orders.map(OrderPresenter.toHTTP) };
  }
}
