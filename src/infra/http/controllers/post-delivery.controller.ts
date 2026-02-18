import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { PostDeliveryUseCase } from '@/domain/use-cases/post-delivery';
import { Public } from '@/infra/auth/public';

@Controller('/orders/:orderId/posted')
export class PostDeliveryController {
  constructor(private postDelivery: PostDeliveryUseCase) {}

  @Patch()
  @Public()
  @HttpCode(204)
  async handle(@Param('orderId') orderId: string) {
    const result = await this.postDelivery.execute({
      orderId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
