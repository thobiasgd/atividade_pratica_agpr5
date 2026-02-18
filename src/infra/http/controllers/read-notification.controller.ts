import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification';
import z from 'zod';
import { Public } from '@/infra/auth/public';

const createUserBodySchema = z.object({
  userCpf: z.string(),
});

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>;
@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase) {}

  @Patch()
  @Public()
  @HttpCode(204)
  async handle(
    @Body() body: CreateUserBodySchema,
    @Param('notificationId') notificationId: string,
  ) {
    const { userCpf } = body;

    const result = await this.readNotification.execute({
      notificationId,
      recipientCpf: userCpf,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
