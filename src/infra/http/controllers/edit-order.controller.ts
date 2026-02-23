import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { EditOrderUseCase } from '@/domain/use-cases/edit-order';

const editOrderBodySchema = z.object({
  newOrderDescription: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(editOrderBodySchema);

type EditOrderBodySchema = z.infer<typeof editOrderBodySchema>;

@Controller('/orders/:orderId/edit')
export class EditOrderController {
  constructor(private editOrder: EditOrderUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditOrderBodySchema,
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
