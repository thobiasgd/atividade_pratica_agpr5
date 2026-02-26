import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersRepository } from '@/domain/repositories/user-repository';
import { PrismaUserRepository } from './prisma/repositories/prisma-user-repository';
import { RecipientsRepository } from '@/domain/repositories/recipient-repository';
import { PrismaRecipientRepository } from './prisma/repositories/prisma-recipient-repository';
import { AddressRepository } from '@/domain/repositories/address-repository';
import { PrismaAddressRepository } from './prisma/repositories/prisma-address-repository';
import { OrderRepository } from '@/domain/repositories/order-repository';
import { PrismaOrderRepository } from './prisma/repositories/prisma-order-repository';
import { AttachmentsRepository } from '@/domain/repositories/attachments-repository';
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository';
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository';
import { ChecklistRepository } from '@/domain/repositories/checklist-repository';
import { PrismaChecklistRepository } from './prisma/repositories/prisma-checklist-respository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientRepository,
    },
    {
      provide: AddressRepository,
      useClass: PrismaAddressRepository,
    },
    {
      provide: OrderRepository,
      useClass: PrismaOrderRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
    {
      provide: ChecklistRepository,
      useClass: PrismaChecklistRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    RecipientsRepository,
    AddressRepository,
    OrderRepository,
    AttachmentsRepository,
    NotificationsRepository,
    ChecklistRepository,
  ],
})
export class DatabaseModule {}
