import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { Roles } from '@/infra/auth/roles';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteNotificationUseCase } from '@/domain/use-cases/notifications/delete-notifications';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('/notifications/:id')
export class DeleteNotificationController {
  constructor(private deleteNotification: DeleteNotificationUseCase) {}

  @Delete()
  @ApiOperation({
    summary: 'Rota para remoção de destinatários existentes.',
  })
  @Roles('ADMIN')
  @HttpCode(204)
  async handle(@Param('id') notificationId: string) {
    const result = await this.deleteNotification.execute({
      notificationId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
