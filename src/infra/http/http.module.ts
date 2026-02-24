import { Module } from '@nestjs/common';
import { CreateUserController } from './controllers/users/create-user.controller';
import { RegisterUserUseCase } from '@/domain/use-cases/users/register-user';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { AuthenticateController } from './controllers/users/authenticate.controller';
import { AuthenticateUserUseCase } from '@/domain/use-cases/users/authenticate-user';
import { CreateRecipientController } from './controllers/recipients/create-recipient.controller';
import { RegisterRecipientUseCase } from '@/domain/use-cases/recipients/register-recipient';
import { AddressRecipientController } from './controllers/addresses/create-address.controller';
import { RegisterAddressUseCase } from '@/domain/use-cases/addresses/register-address';
import { CreateOrderController } from './controllers/orders/create-order.controller';
import { RegisterOrderUseCase } from '@/domain/use-cases/orders/register-order';
import { AsignDeliveryToCarrierController } from './controllers/orders/asign-delivery-to-carrier.controller';
import { PostDeliveryController } from './controllers/orders/post-delivery.controller';
import { PostDeliveryUseCase } from '@/domain/use-cases/orders/post-delivery';
import { OnTheWayDeliveryController } from './controllers/orders/on-the-way-delivery.controller';
import { OnTheWayDeliveryUseCase } from '@/domain/use-cases/orders/on-the-way-delivery';
import { ReturnDeliveryController } from './controllers/orders/return-delivery.controller';
import { ReturnDeliveryUseCase } from '@/domain/use-cases/orders/return-delivery';
import { FetchNearOrdersController } from './controllers/orders/fetch-near-orders.controller';
import { FetchNearOrdersUseCase } from '@/domain/use-cases/orders/fetch-near-orders';
import { AlterPasswordController } from './controllers/users/alter-password.controller';
import { AlterPasswordUseCase } from '@/domain/use-cases/users/alter-user-password';
import { FetchUserOrdersController } from './controllers/orders/fetch-user-orders.controller';
import { FetchUserOrdersUseCase } from '@/domain/use-cases/orders/fetch-user-orders';
import { UploadAttachmentController } from './controllers/attachments/upload-attachment.controller';
import { UploadAndCreateAttachmentUseCase } from '@/domain/use-cases/attachments/upload-and-create-attachment';
import { StorageModule } from '../storage/storage.module';
import { ReadNotificationController } from './controllers/notifications/read-notification.controller';
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification';
import { FetchSingleUserController } from './controllers/users/fetch-single-user.controller';
import { FetchSingleUserUseCase } from '@/domain/use-cases/users/fetch-single-user';
import { fetchListOfUsersController } from './controllers/users/fetch-list-of-users.controller';
import { fetchListOfUsersUseCase } from '@/domain/use-cases/users/fetch-list-of-users';
import { EditUserController } from './controllers/users/edit-user.controller';
import { DeleteUserController } from './controllers/users/delete-user.controller';
import { DeleteUserUseCase } from '@/domain/use-cases/users/delete-user';
import { FetchSingleOrderController } from './controllers/orders/fetch-single-order.controller';
import { FetchSingleOrderUseCase } from '@/domain/use-cases/orders/fetch-single-order';
import { fetchListOfOrdersController } from './controllers/orders/fetch-list-of-orders.controller';
import { fetchListOfOrdersUseCase } from '@/domain/use-cases/orders/fetch-list-of-orders';
import { EditOrderController } from './controllers/orders/edit-order.controller';
import { EditOrderUseCase } from '@/domain/use-cases/orders/edit-order';
import { EditUserUseCase } from '@/domain/use-cases/users/edit-user';
import { DeleteOrderController } from './controllers/orders/delete-order.controller';
import { DeleteOrderUseCase } from '@/domain/use-cases/orders/delete-order';
import { fetchListOfRecipientsController } from './controllers/recipients/fetch-list-of-recipients.controller';
import { fetchListOfRecipientsUseCase } from '@/domain/use-cases/recipients/fetch-list-of-recipients';
import { EditRecipientController } from './controllers/recipients/edit-recipient.controller';
import { EditRecipientUseCase } from '@/domain/use-cases/recipients/edit-recipient';
import { DeleteRecipientController } from './controllers/recipients/delete-recipient.controller';
import { DeleteRecipientUseCase } from '@/domain/use-cases/recipients/delete-recipient';
import { AsignDeliveryToCarrierUseCase } from '@/domain/use-cases/orders/asign-delivery-to-carrier';
import { FetchRecipientAddresssController } from './controllers/addresses/list-recipient-addresses.controller';
import { FetchRecipientAddressesUseCase } from '@/domain/use-cases/addresses/fetch-recipient-addresses';
import { EditAddressController } from './controllers/addresses/edit-address.controller';
import { EditAddressUseCase } from '@/domain/use-cases/addresses/edit-addresses';
import { DeleteAddressController } from './controllers/addresses/delete-address.controller';
import { DeleteAddressUseCase } from '@/domain/use-cases/addresses/delete-address';
import { DeliverDeliveryController } from './controllers/orders/delivered-delivery.controller';
import { fetchListOfAttachmentsController } from './controllers/attachments/fetch-list-attatchment-from-order.controller';
import { fetchListOfAttachmentsUseCase } from '@/domain/use-cases/attachments/fetch-list-of-attachments';
import { DeliverDeliveryUseCase } from '@/domain/use-cases/orders/deliver-delivery';
import { DeleteAttachmentUseCase } from '@/domain/use-cases/attachments/delete-attachment';
import { DeleteAttachmentController } from './controllers/attachments/delete-attachment.controller';
import { fetchListOfNotificationsController } from './controllers/notifications/fetch-list-of-notifications.controller';
import { fetchListOfNotificationsUseCase } from '@/domain/use-cases/notifications/fetch-list-of-notifications';
import { DeleteNotificationController } from './controllers/notifications/delete-notification.controller';
import { DeleteNotificationUseCase } from '@/domain/use-cases/notifications/delete-notifications';

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
    ReturnDeliveryController,
    FetchNearOrdersController,
    AlterPasswordController,
    FetchUserOrdersController,
    UploadAttachmentController,
    ReadNotificationController,
    FetchSingleUserController,
    fetchListOfUsersController,
    EditUserController,
    DeleteUserController,
    FetchSingleOrderController,
    fetchListOfOrdersController,
    EditOrderController,
    DeleteOrderController,
    fetchListOfRecipientsController,
    EditRecipientController,
    DeleteRecipientController,
    FetchRecipientAddresssController,
    EditAddressController,
    DeleteAddressController,
    DeliverDeliveryController,
    fetchListOfAttachmentsController,
    DeleteAttachmentController,
    fetchListOfNotificationsController,
    DeleteNotificationController,
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
    ReturnDeliveryUseCase,
    FetchNearOrdersUseCase,
    AlterPasswordUseCase,
    FetchUserOrdersUseCase,
    UploadAndCreateAttachmentUseCase,
    ReadNotificationUseCase,
    FetchSingleUserUseCase,
    fetchListOfUsersUseCase,
    EditUserUseCase,
    DeleteUserUseCase,
    FetchSingleOrderUseCase,
    fetchListOfOrdersUseCase,
    EditOrderUseCase,
    DeleteOrderUseCase,
    fetchListOfRecipientsUseCase,
    EditRecipientUseCase,
    DeleteRecipientUseCase,
    FetchRecipientAddressesUseCase,
    EditAddressUseCase,
    DeleteAddressUseCase,
    DeliverDeliveryUseCase,
    fetchListOfAttachmentsUseCase,
    DeleteAttachmentUseCase,
    fetchListOfNotificationsUseCase,
    DeleteNotificationUseCase,
  ],
})
export class HttpModule {}
