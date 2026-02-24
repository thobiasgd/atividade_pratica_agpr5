import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper';
import { Attachment } from '@/domain/entities/attachment';
import { AttachmentsRepository } from '@/domain/repositories/attachments-repository';

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Attachment | null> {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id },
    });
    return attachment ? PrismaAttachmentMapper.toDomain(attachment) : null;
  }

  async fetchListOfAttachments(orderId: string): Promise<Attachment[]> {
    const attachments = await this.prisma.attachment.findMany({
      where: { orderId },
    });

    return attachments.map(PrismaAttachmentMapper.toDomain);
  }

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachment);

    await this.prisma.attachment.create({ data });
  }

  async delete(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachment);

    await this.prisma.attachment.deleteMany({
      where: {
        id: data.id,
      },
    });
  }
}
