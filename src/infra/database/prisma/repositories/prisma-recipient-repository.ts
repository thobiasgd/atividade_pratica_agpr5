import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Recipient } from '@/domain/entities/recipient';
import { RecipientsRepository } from '@/domain/repositories/recipient-repository';
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper';

@Injectable()
export class PrismaRecipientRepository implements RecipientsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({ where: { id } });
    return recipient ? PrismaRecipientMapper.toDomain(recipient) : null;
  }

  async fetchListOfRecipients(page: number): Promise<Recipient[]> {
    const recipients = await this.prisma.recipient.findMany({
      take: 20,
      skip: (page - 1) * 20,
    });

    return recipients.map(PrismaRecipientMapper.toDomain);
  }

  async findByCpf(cpf: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        cpf,
      },
    });
    if (!recipient) {
      return null;
    }

    return PrismaRecipientMapper.toDomain(recipient);
  }

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await this.prisma.recipient.create({
      data,
    });
  }

  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await Promise.all([
      this.prisma.recipient.update({
        where: {
          id: recipient.id.toString(),
        },
        data,
      }),
    ]);
  }

  async delete(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await this.prisma.order.deleteMany({
      where: {
        recipientId: data.id,
      },
    });

    await this.prisma.address.deleteMany({
      where: {
        recipientId: data.id,
      },
    });

    await this.prisma.notification.deleteMany({
      where: {
        recipientId: data.id,
      },
    });

    await this.prisma.recipient.delete({
      where: {
        id: data.id,
      },
    });
  }
}
