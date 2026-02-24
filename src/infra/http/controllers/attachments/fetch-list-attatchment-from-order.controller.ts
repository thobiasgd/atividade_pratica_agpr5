import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { fetchListOfAttachmentsUseCase } from '@/domain/use-cases/attachments/fetch-list-of-attachments';
import { AttachmentPresenter } from '../../presenters/attachments-presenter';

@ApiTags('Attachments')
@ApiBearerAuth()
@Controller('/attachments/:orderId/list-attachments')
export class fetchListOfAttachmentsController {
  constructor(private fetchAttachments: fetchListOfAttachmentsUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Rota para listar os attachments de uma encomenda.',
  })
  async handle(@Param('orderId') orderId: string) {
    const result = await this.fetchAttachments.execute({
      orderId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const attachments = result.value.attachments;

    return attachments.map(AttachmentPresenter.toHTTP);
  }
}
