import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import { ReturnDeliveryUseCase } from '@/domain/use-cases/return-delivery';

@Controller('/orders/:orderId/return')
export class ReturnDeliveryController {
  constructor(private returnDelivery: ReturnDeliveryUseCase) {}

  @Patch()
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
