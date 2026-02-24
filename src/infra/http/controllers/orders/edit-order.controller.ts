import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { EditOrderUseCase } from '@/domain/use-cases/orders/edit-order';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { bodyValidationPipe, EditOrderDTO } from './dto/edit-order.dto';

@ApiTags('Orders')
@Controller('/orders/:orderId/edit')
export class EditOrderController {
  constructor(private editOrder: EditOrderUseCase) {}

  @Put()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Rota para edição de encomendas existentes.',
  })
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditOrderDTO,
    @CurrentUser() order: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const { newOrderDescription } = body;
    const orderIdBearer = order.sub;

    const result = await this.editOrder.execute({
      orderIdBearer,
      orderId,
      newOrderDescription,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
