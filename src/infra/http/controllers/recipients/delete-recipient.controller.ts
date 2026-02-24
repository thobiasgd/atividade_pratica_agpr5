import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { DeleteRecipientUseCase } from '@/domain/use-cases/recipients/delete-recipient';
import { Roles } from '@/infra/auth/roles';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Recipients')
@ApiBearerAuth()
@Controller('/recipients/:id')
export class DeleteRecipientController {
  constructor(private deleteRecipient: DeleteRecipientUseCase) {}

  @Delete()
  @ApiOperation({
    summary: 'Rota para remoção de destinatários existentes.',
  })
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
