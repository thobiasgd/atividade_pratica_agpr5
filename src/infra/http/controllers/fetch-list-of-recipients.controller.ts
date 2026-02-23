import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { fetchListOfRecipientsUseCase } from '@/domain/use-cases/fetch-list-of-recipients';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import z from 'zod';
import { RecipientPresenter } from '../presenters/recipient-presenter';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/list-of-recipients')
export class fetchListOfRecipientsController {
  constructor(private fetchRecipients: fetchListOfRecipientsUseCase) {}

  @Get()
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
