import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { Roles } from '@/infra/auth/roles';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteAttachmentUseCase } from '@/domain/use-cases/attachments/delete-attachment';

@ApiTags('Attachments')
@ApiBearerAuth()
@Controller('/attachments/:id')
export class DeleteAttachmentController {
  constructor(private deleteAttachment: DeleteAttachmentUseCase) {}

  @Delete()
  @ApiOperation({
    summary: 'Rota para remoção de anexos de encomendas existentes.',
  })
  @Roles('ADMIN')
  @HttpCode(204)
  async handle(@Param('id') attachmentId: string) {
    const result = await this.deleteAttachment.execute({
      attachmentId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
