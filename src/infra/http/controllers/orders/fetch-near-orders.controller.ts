import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { FetchNearOrdersUseCase } from '@/domain/use-cases/orders/fetch-near-orders';
import { OrderPresenter } from '../../presenters/order-presenter';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

const neighborhoodQueryParamSchema = z.string();

const queryValidationPipe = new ZodValidationPipe(neighborhoodQueryParamSchema);

type NeighborhoodValidationPipe = z.infer<typeof neighborhoodQueryParamSchema>;

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/nearOrders')
export class FetchNearOrdersController {
  constructor(private fetchNearOrders: FetchNearOrdersUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Rota para listagem de encomendas próximas a um bairo específico.',
  })
  @ApiQuery({
    name: 'neighborhood',
    required: false,
    description: 'Bairro a ser filtrado',
  })
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

    return orders.map(OrderPresenter.toHTTP);
  }
}
