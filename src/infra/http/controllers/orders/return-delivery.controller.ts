import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import { ReturnDeliveryUseCase } from '@/domain/use-cases/orders/return-delivery';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders/:orderId/return')
export class ReturnDeliveryController {
  constructor(private returnDelivery: ReturnDeliveryUseCase) {}

  @Patch()
  @ApiOperation({
    summary: 'Rota para alterar o status de uma encomenda para "RETURNED"',
  })
  @Public()
  @HttpCode(204)
  async handle(@Param('orderId') orderId: string) {
    const result = await this.returnDelivery.execute({
      orderId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
