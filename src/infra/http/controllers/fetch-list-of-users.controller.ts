import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { fetchListOfUsersUseCase } from '@/domain/use-cases/fetch-list-of-users';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import z from 'zod';
import { UserPresenter } from '../presenters/user-presenter';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/users')
export class fetchListOfUsersController {
  constructor(private fetchUsers: fetchListOfUsersUseCase) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchUsers.execute({
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const users = result.value.users;

    return users.map(UserPresenter.toHTTP);
  }
}
