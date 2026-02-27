import {
  Controller,
  Param,
  Patch,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiParam({ name: 'orderId', type: 'string', format: 'uuid' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            description: 'Foto a ser enviada para comprovação de entrega.',
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['files'],
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: {
        fileSize: 1024 * 1024 * 2,
      },
      fileFilter: (req, file, callback) => {
        const allowed = ['image/jpeg', 'image/png', 'application/pdf'];

        if (!allowed.includes(file.mimetype)) {
          return callback(new Error('Invalid file type'), false);
        }

        callback(null, true);
      },
    }),
  )
  async handle(
    @UploadedFiles()
    files: Express.Multer.File[],
    @Param('orderId') orderId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const results = await Promise.all(
      files.map((file) =>
        this.deliverDelivery.execute({
          orderId,
          userId: user.sub,
          fileName: file.originalname,
          fileType: file.mimetype,
          body: file.buffer,
        }),
      ),
    );
  }
}
