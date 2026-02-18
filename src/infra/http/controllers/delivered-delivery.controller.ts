import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DeliverDeliveryUseCase } from '@/domain/use-cases/deliver-delivery';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvalidAttachmentTypeError } from '@/domain/use-cases/errors/invalid-attachment-type-error';

@Controller('/orders/:orderId/deliver')
export class DeliverDeliveryController {
  constructor(private deliverDelivery: DeliverDeliveryUseCase) {}

  @Patch()
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(204)
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2mb
          }),
          new FileTypeValidator({
            fileType: '.(png|jpg|jpeg|pdf)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('orderId') orderId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.deliverDelivery.execute({
      orderId,
      userId: user.sub,
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidAttachmentTypeError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
