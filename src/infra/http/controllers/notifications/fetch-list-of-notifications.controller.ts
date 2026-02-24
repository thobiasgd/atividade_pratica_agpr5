import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import z from 'zod';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { NotificationPresenter } from '../../presenters/notification-presenter';
import { fetchListOfNotificationsUseCase } from '@/domain/use-cases/notifications/fetch-list-of-notifications';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('/list-of-notifications')
export class fetchListOfNotificationsController {
  constructor(private fetchNotifications: fetchListOfNotificationsUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Esta rota serve para listar todos as notificações.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página a ser mostrada (20 por página)',
  })
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchNotifications.execute({
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const notifications = result.value.notifications;

    return notifications.map(NotificationPresenter.toHTTP);
  }
}
