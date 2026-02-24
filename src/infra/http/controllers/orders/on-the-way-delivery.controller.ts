import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import { OnTheWayDeliveryUseCase } from '@/domain/use-cases/orders/on-the-way-delivery';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders/:orderId/on-the-way')
export class OnTheWayDeliveryController {
  constructor(private onTheWayDelivery: OnTheWayDeliveryUseCase) {}

  @Patch()
  @ApiOperation({
    summary:
      '[DEPRECIATED] Rota para alterar o status de uma encomenda para "ON_THE_WAY"',
  })
  @Public()
  @HttpCode(204)
  async handle(@Param('orderId') orderId: string) {
    const result = await this.onTheWayDelivery.execute({
      orderId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
