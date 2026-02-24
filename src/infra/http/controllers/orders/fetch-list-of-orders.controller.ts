import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { fetchListOfOrdersUseCase } from '@/domain/use-cases/orders/fetch-list-of-orders';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import z from 'zod';
import { Roles } from '@/infra/auth/roles';
import { OrderWithDetailsPresenter } from '../../presenters/order-with-details-presenter';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/list-of-orders')
export class fetchListOfOrdersController {
  constructor(private fetchOrders: fetchListOfOrdersUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Rota para listagem de todas as encomendas.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página de busca (20 por busca)',
  })
  @Roles('ADMIN')
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchOrders.execute({
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const orders = result.value.orders;

    return orders.map(OrderWithDetailsPresenter.toHTTP);
  }
}

//swagger
