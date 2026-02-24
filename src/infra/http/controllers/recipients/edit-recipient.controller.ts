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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { bodyValidationPipe, EditRecipientDTO } from './dto/edit-recipient.dto';

@ApiTags('Recipients')
@ApiBearerAuth()
@Controller('/recipients/:recipientId/edit')
export class EditRecipientController {
  constructor(private editRecipient: EditRecipientUseCase) {}

  @Put()
  @ApiOperation({
    summary: 'Rota para edição de destinatários existentes.',
  })
  @HttpCode(204)
  @Roles('ADMIN')
  async handle(
    @Body(bodyValidationPipe) body: EditRecipientDTO,
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
