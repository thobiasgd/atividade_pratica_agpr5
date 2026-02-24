import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification';
import { Public } from '@/infra/auth/public';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase) {}

  @Patch()
  @ApiOperation({
    summary:
      'Rota para confirmação de leitura das notificações dos destinatários',
  })
  @Public()
  @HttpCode(204)
  async handle(@Param('notificationId') notificationId: string) {
    const result = await this.readNotification.execute({
      notificationId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
