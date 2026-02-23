import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { DeleteRecipientUseCase } from '@/domain/use-cases/delete-recipient';
import { Roles } from '@/infra/auth/roles';

@Controller('/recipients/:id')
export class DeleteRecipientController {
  constructor(private deleteRecipient: DeleteRecipientUseCase) {}

  @Delete()
  @Roles('ADMIN')
  @HttpCode(204)
  async handle(@Param('id') recipientId: string) {
    const result = await this.deleteRecipient.execute({
      recipientId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
