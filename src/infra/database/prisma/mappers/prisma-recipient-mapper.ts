import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Recipient } from '@/domain/entities/recipient';
import { Recipient as PrismaRecipient, Prisma } from '@prisma/client';

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        cpf: raw.cpf,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      cpf: recipient.cpf,
    };
  }
}
