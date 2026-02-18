import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import { OnTheWayDeliveryUseCase } from '@/domain/use-cases/on-the-way-delivery';

@Controller('/orders/:orderId/on-the-way')
export class OnTheWayDeliveryController {
  constructor(private onTheWayDelivery: OnTheWayDeliveryUseCase) {}

  @Patch()
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
