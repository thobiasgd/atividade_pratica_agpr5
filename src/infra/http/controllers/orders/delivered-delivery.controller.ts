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
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvalidAttachmentTypeError } from '@/core/errors/errors/invalid-attachment-type-error';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeliverDeliveryUseCase } from '@/domain/use-cases/orders/deliver-delivery';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders/:orderId/deliver')
export class DeliverDeliveryController {
  constructor(private deliverDelivery: DeliverDeliveryUseCase) {}

  @Patch()
  @ApiOperation({
    summary:
      'Rota entregar e realizar upload de anexo para marcar encomenda como "DELIVERED"',
  })
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
