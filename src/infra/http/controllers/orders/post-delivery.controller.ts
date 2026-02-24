import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { PostDeliveryUseCase } from '@/domain/use-cases/orders/post-delivery';
import { Public } from '@/infra/auth/public';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders/:orderId/posted')
export class PostDeliveryController {
  constructor(private postDelivery: PostDeliveryUseCase) {}

  @Patch()
  @ApiOperation({
    summary:
      '[DEPRECIATED] Rota para alterar o status de uma encomenda para "WAITING"',
  })
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
