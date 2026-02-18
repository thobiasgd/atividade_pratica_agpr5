import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { FetchNearOrdersUseCase } from '@/domain/use-cases/fetch-near-orders';
import { OrderPresenter } from '../presenters/order-presenter';

const neighborhoodQueryParamSchema = z.string();

const queryValidationPipe = new ZodValidationPipe(neighborhoodQueryParamSchema);

type NeighborhoodValidationPipe = z.infer<typeof neighborhoodQueryParamSchema>;

@Controller('/nearOrders')
export class FetchNearOrdersController {
  constructor(private fetchNearOrders: FetchNearOrdersUseCase) {}

  @Get()
  async handle(
    @Query('neighborhood', queryValidationPipe)
    neighborhood: NeighborhoodValidationPipe,
  ) {
    const result = await this.fetchNearOrders.execute({
      neighborhood,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const orders = result.value.orders;

    return { orders: orders.map(OrderPresenter.toHTTP) };
  }
}
