import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { AsignDeliveryToCarrierUseCase } from '@/domain/use-cases/orders/asign-delivery-to-carrier';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders/:orderId/asign-carrier')
export class AsignDeliveryToCarrierController {
  constructor(private asignDeliveryToCarrier: AsignDeliveryToCarrierUseCase) {}

  @Patch()
  @ApiOperation({
    summary: 'Rota para designação de usuários para as respectivos encomendas.',
  })
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const userId = user.sub;

    const result = await this.asignDeliveryToCarrier.execute({
      orderId,
      userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
