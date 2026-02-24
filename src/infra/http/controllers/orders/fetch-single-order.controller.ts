import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { OrderPresenter } from '../../presenters/order-presenter';
import { FetchSingleOrderUseCase } from '@/domain/use-cases/orders/fetch-single-order';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders/:orderId')
export class FetchSingleOrderController {
  constructor(private fetchOrder: FetchSingleOrderUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Rota para listagem de uma única encomenda.',
  })
  async handle(@Param('orderId') orderId: string) {
    const result = await this.fetchOrder.execute({
      orderId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const order = result.value.order;

    return OrderPresenter.toHTTP(order);
  }
}
