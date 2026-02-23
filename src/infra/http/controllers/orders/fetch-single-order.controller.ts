import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { OrderPresenter } from '../../presenters/order-presenter';
import { FetchSingleOrderUseCase } from '@/domain/use-cases/orders/fetch-single-order';

@Controller('/orders/:orderId')
export class FetchSingleOrderController {
  constructor(private fetchOrder: FetchSingleOrderUseCase) {}

  @Get()
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
