import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { fetchListOfRecipientsUseCase } from '@/domain/use-cases/recipients/fetch-list-of-recipients';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import z from 'zod';
import { RecipientPresenter } from '../../presenters/recipient-presenter';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@ApiTags('Recipients')
@ApiBearerAuth()
@Controller('/list-of-recipients')
export class fetchListOfRecipientsController {
  constructor(private fetchRecipients: fetchListOfRecipientsUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Esta rota serve para listar todos os destinatários',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página a ser mostrada (20 por página)',
  })
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchRecipients.execute({
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const recipients = result.value.recipients;

    return recipients.map(RecipientPresenter.toHTTP);
  }
}
