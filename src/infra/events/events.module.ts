import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { OrderCreatedEvent } from '@/domain/events/order-created-event';
import { OnOrderCreated } from '@/domain/notification/application/subscribers/on-order-created';
import { OnOrderAssignedToCarrier } from '@/domain/notification/application/subscribers/on-order-assigned-to-carrier';
import { OnOrderDelivered } from '@/domain/notification/application/subscribers/on-order-delivered';
import { OnOrderReturned } from '@/domain/notification/application/subscribers/on-order-returned';

@Module({
  imports: [DatabaseModule],
  providers: [
    OrderCreatedEvent,
    SendNotificationUseCase,
    OnOrderCreated,
    OnOrderAssignedToCarrier,
    OnOrderDelivered,
    OnOrderReturned,
  ],
})
export class EventsModule {}
