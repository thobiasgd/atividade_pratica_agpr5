import { UploadAndCreateAttachmentUseCase } from '@/domain/use-cases/attachments/upload-and-create-attachment';
import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Attachments')
@ApiBearerAuth()
@Controller('/attachments')
export class UploadAttachmentController {
  constructor(
    private uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary:
      'Rota para upload de anexos para confirmação de entrega das encomendas',
  })
  @UseInterceptors(FileInterceptor('files'))
  async handle(
    @Param('orderId') orderId: string,
    @UploadedFiles(
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
    files: Express.Multer.File[],
  ) {
    const result = await Promise.all(
      files.map((file) => {
        this.uploadAndCreateAttachment.execute({
          orderId: orderId,
          fileName: file.originalname,
          fileType: file.mimetype,
          body: file.buffer,
        });
      }),
    );
    /* const result = await this.uploadAndCreateAttachment.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    }); */

    /* if (result.isLeft()) {
      const error = result.values;

      switch (error.constructor) {
        case InvalidAttachmentTypeError:
          throw new BadRequestException(error.);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { attachment } = result.values;

    return {
      attachmentId: attachment.id.toString(),
    }; */
  }
}
