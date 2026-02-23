import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { EditRecipientUseCase } from '@/domain/use-cases/recipients/edit-recipient';
import { Roles } from '@/infra/auth/roles';

const editRecipientBodySchema = z.object({
  newRecipientCpf: z.string(),
  newRecipientName: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(editRecipientBodySchema);

type EditRecipientBodySchema = z.infer<typeof editRecipientBodySchema>;

@Controller('/recipients/:recipientId/edit')
export class EditRecipientController {
  constructor(private editRecipient: EditRecipientUseCase) {}

  @Put()
  @HttpCode(204)
  @Roles('ADMIN')
  async handle(
    @Body(bodyValidationPipe) body: EditRecipientBodySchema,
    @Param('recipientId') recipientId: string,
  ) {
    const { newRecipientCpf, newRecipientName } = body;

    const result = await this.editRecipient.execute({
      recipientId,
      newRecipientCpf,
      newRecipientName,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
