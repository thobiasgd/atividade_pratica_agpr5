import { Module } from '@nestjs/common';
import { CreateUserController } from './controllers/create-user.controller';
import { RegisterUserUseCase } from '@/domain/use-cases/register-user';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { AuthenticateUserUseCase } from '@/domain/use-cases/authenticate-user';
import { CreateRecipientController } from './controllers/create-recipient.controller';
import { RegisterRecipientUseCase } from '@/domain/use-cases/register-recipient';
import { AddressRecipientController } from './controllers/create-address.controller';
import { RegisterAddressUseCase } from '@/domain/use-cases/register-address';
import { CreateOrderController } from './controllers/create-order.controller';
import { RegisterOrderUseCase } from '@/domain/use-cases/register-order';
import { AsignDeliveryToCarrierController } from './controllers/asign-delivery-to-carrier.controller';
import { AsignDeliveryToCarrierUseCase } from '@/domain/use-cases/asign-delivery-to-carrier';
import { PostDeliveryController } from './controllers/post-delivery.controller';
import { PostDeliveryUseCase } from '@/domain/use-cases/post-delivery';
import { OnTheWayDeliveryController } from './controllers/on-the-way-delivery.controller';
import { OnTheWayDeliveryUseCase } from '@/domain/use-cases/on-the-way-delivery';
import { DeliverDeliveryController } from './controllers/delivered-delivery.controller';
import { DeliverDeliveryUseCase } from '@/domain/use-cases/deliver-delivery';
import { ReturnDeliveryController } from './controllers/return-delivery.controller';
import { ReturnDeliveryUseCase } from '@/domain/use-cases/return-delivery';
import { FetchNearOrdersController } from './controllers/fetch-near-orders.controller';
import { FetchNearOrdersUseCase } from '@/domain/use-cases/fetch-near-orders';
import { AlterPasswordController } from './controllers/alter-password.controller';
import { AlterPasswordUseCase } from '@/domain/use-cases/alter-user-password';
import { FetchUserOrdersController } from './controllers/fetch-user-orders.controller';
import { FetchUserOrdersUseCase } from '@/domain/use-cases/fetch-user-orders';
import { UploadAttachmentController } from './controllers/upload-attachment.controller';
import { UploadAndCreateAttachmentUseCase } from '@/domain/use-cases/upload-and-create-attachment';
import { StorageModule } from '../storage/storage.module';
import { ReadNotificationController } from './controllers/read-notification.controller';
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification';

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateUserController,
    AuthenticateController,
    CreateRecipientController,
    AddressRecipientController,
    CreateOrderController,
    AsignDeliveryToCarrierController,
    PostDeliveryController,
    OnTheWayDeliveryController,
    DeliverDeliveryController,
    ReturnDeliveryController,
    FetchNearOrdersController,
    AlterPasswordController,
    FetchUserOrdersController,
    UploadAttachmentController,
    ReadNotificationController,
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    RegisterRecipientUseCase,
    RegisterAddressUseCase,
    RegisterOrderUseCase,
    AsignDeliveryToCarrierUseCase,
    PostDeliveryUseCase,
    OnTheWayDeliveryUseCase,
    DeliverDeliveryUseCase,
    ReturnDeliveryUseCase,
    FetchNearOrdersUseCase,
    AlterPasswordUseCase,
    FetchUserOrdersUseCase,
    UploadAndCreateAttachmentUseCase,
    ReadNotificationUseCase,
  ],
})
export class HttpModule {}
