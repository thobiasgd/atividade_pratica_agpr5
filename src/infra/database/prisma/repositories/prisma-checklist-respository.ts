import { ChecklistRepository } from '@/domain/repositories/checklist-repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ChecklistTemplate } from '@/domain/entities/checklistTemplate';
import { ChecklistTemplateItem } from '@prisma/client';
import { CompleteChecklist } from '@/domain/entities/complete-checklist';

@Injectable()
export class PrismaChecklistRepository implements ChecklistRepository {
  constructor(private prisma: PrismaService) {}

  async checkOrUncheck(
    body: { checklistInstanceItemId: string; values: boolean }[],
  ): Promise<void> {
    const ids = body.map((i) => i.checklistInstanceItemId);

    const existing = await this.prisma.checklistInstanceItem.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    const existingIds = new Set(existing.map((e) => e.id));
    const missingIds = ids.filter((id) => !existingIds.has(id));

    if (missingIds.length > 0) {
      throw new BadRequestException(
        `ChecklistInstanceItem não encontrado: ${missingIds.join(', ')}`,
      );
    }

    await this.prisma.$transaction(
      body.map((item) =>
        this.prisma.checklistInstanceItem.update({
          where: { id: item.checklistInstanceItemId },
          data: {
            value: item.values,
            checkedAt: item.values ? new Date() : null,
          },
        }),
      ),
    );
  }

  async fetchRequiredChecklistItems(
    orderId: string,
  ): Promise<{ templateItemId: string; atribute: string }[]> {
    const instance = await this.prisma.checklistInstance.findUnique({
      where: { orderId },
      select: { templateId: true },
    });

    if (!instance) {
      throw new BadRequestException('Instance not found.');
    }

    const requiredItems = await this.prisma.checklistTemplateItem.findMany({
      where: {
        templateId: instance.templateId,
        required: true,
      },
      select: { id: true, atribute: true },
      orderBy: { sortOrder: 'asc' },
    });

    return requiredItems.map((ti) => ({
      templateItemId: ti.id,
      atribute: ti.atribute,
    }));
  }

  async fetchRequiredChecklistOrder(
    orderId: string,
  ): Promise<CompleteChecklist> {
    const instance = await this.prisma.checklistInstance.findUnique({
      where: { orderId },
      select: { templateId: true },
    });

    if (!instance) {
      throw new BadRequestException('Instance not found.');
    }

    const checklistTemplate = await this.prisma.checklistTemplate.findUnique({
      where: { id: instance.templateId },
      select: { id: true, checklistName: true },
    });

    if (!checklistTemplate) {
      throw new BadRequestException('Checklist not found.');
    }

    const requiredItems = await this.prisma.checklistTemplateItem.findMany({
      where: {
        templateId: checklistTemplate.id,
        required: true,
      },
      select: { id: true, atribute: true, sortOrder: true },
      orderBy: { sortOrder: 'asc' },
    });

    const items = requiredItems.map((ti) => ({
      templateItemId: ti.id,
      atribute: ti.atribute,
      value: true,
    }));

    return CompleteChecklist.create({
      templateId: checklistTemplate.id,
      checklistName: checklistTemplate.checklistName,
      items,
    });
  }

  async fetchCompleteChecklistOrder(
    orderId: string,
  ): Promise<CompleteChecklist> {
    const instance = await this.prisma.checklistInstance.findUnique({
      where: { orderId },
      select: { id: true, templateId: true },
    });

    if (!instance) {
      throw new BadRequestException('Instance not found.');
    }

    const checklistTemplate = await this.prisma.checklistTemplate.findUnique({
      where: { id: instance.templateId },
      select: { id: true, checklistName: true },
    });

    if (!checklistTemplate) {
      throw new BadRequestException('Checklist not found.');
    }

    const templateItems = await this.prisma.checklistTemplateItem.findMany({
      where: { templateId: checklistTemplate.id },
      select: { id: true, atribute: true, sortOrder: true },
      orderBy: { sortOrder: 'asc' },
    });

    if (templateItems.length === 0) {
      throw new BadRequestException('Template items not found.');
    }

    const instanceItems = await this.prisma.checklistInstanceItem.findMany({
      where: { instanceId: instance.id },
      select: { templateItemId: true, value: true },
    });

    const valueByTemplateItemId = new Map(
      instanceItems.map((ii) => [ii.templateItemId, ii.value]),
    );

    const items = templateItems.map((ti) => ({
      templateItemId: ti.id, // ✅ ADD
      atribute: ti.atribute,
      value: valueByTemplateItemId.get(ti.id) ?? false,
    }));

    return CompleteChecklist.create({
      templateId: checklistTemplate.id,
      checklistName: checklistTemplate.checklistName,
      items,
    });
  }

  async createRelationChecklistOrder(
    orderId: string,
    checklistId: string,
  ): Promise<void> {
    await this.prisma.checklistInstance.create({
      data: {
        orderId: orderId,
        templateId: checklistId,
      },
    });
  }

  async createNewChecklist(
    checklistTemplate: ChecklistTemplate,
  ): Promise<void> {
    await this.prisma.checklistTemplate.create({
      data: {
        id: checklistTemplate.id.toString(),
        checklistName: checklistTemplate.checklistName,
        version: checklistTemplate.version,
        status: checklistTemplate.status,
        createdAt: checklistTemplate.createdAt,
      },
    });
  }
  async insertItensInChecklistTemplate(
    checklistTemplateItem: ChecklistTemplateItem[],
  ): Promise<void> {
    await Promise.all(
      checklistTemplateItem.map((item) =>
        this.prisma.checklistTemplateItem.create({
          data: {
            templateId: item.templateId,
            atribute: item.atribute,
            required: item.required,
            sortOrder: item.sortOrder,
          },
        }),
      ),
    );
  }

  async onOrderCreation(orderId: string): Promise<void> {
    const instance = await this.prisma.checklistInstance.findUnique({
      where: {
        orderId: orderId,
      },
    });

    if (!instance) {
      throw new BadRequestException('Checklist not found');
    }

    const templateId = instance.templateId;

    const items = await this.prisma.checklistTemplateItem.findMany({
      where: {
        templateId: templateId,
      },
    });

    await Promise.all(
      items.map((item) =>
        this.prisma.checklistInstanceItem.create({
          data: {
            instanceId: instance.id,
            templateItemId: item.id,
            value: false,
            checkedAt: null,
          },
        }),
      ),
    );
  }
}
