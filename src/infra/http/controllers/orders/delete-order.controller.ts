import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { DeleteOrderUseCase } from '@/domain/use-cases/orders/delete-order';
import { Roles } from '@/infra/auth/roles';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders/:id')
export class DeleteOrderController {
  constructor(private deleteOrder: DeleteOrderUseCase) {}

  @Delete()
  @ApiOperation({
    summary: 'Rota para remoção de encomendas existentes.',
  })
  @Roles('ADMIN')
  @HttpCode(204)
  async handle(@Param('id') orderId: string) {
    const result = await this.deleteOrder.execute({
      orderId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
