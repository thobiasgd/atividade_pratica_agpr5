import { ChecklistRepository } from '@/domain/repositories/checklist-repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ChecklistTemplate } from '@/domain/entities/checklistTemplate';
import { ChecklistTemplateItem, ChecklistTemplateStatus } from '@prisma/client';
import { CompleteChecklist } from '@/domain/entities/complete-checklist';

@Injectable()
export class PrismaChecklistRepository implements ChecklistRepository {
  constructor(private prisma: PrismaService) {}

  async editChecklistName(
    templateId: string,
    newTemplateName: string,
  ): Promise<void> {
    const template = await this.prisma.checklistTemplate.findUnique({
      where: {
        id: templateId,
      },
    });

    await this.prisma.checklistTemplate.updateMany({
      where: {
        checklistName: template?.checklistName,
      },
      data: {
        checklistName: newTemplateName,
      },
    });
  }

  async fetchAllCompleteChecklistOrder(): Promise<
    {
      id: string;
      checklistName: string;
      version: number;
      status: ChecklistTemplateStatus;
    }[]
  > {
    const templates = await this.prisma.checklistTemplate.findMany({
      distinct: ['checklistName'],
      select: {
        id: true,
        checklistName: true,
        version: true,
        status: true,
      },
      orderBy: [{ checklistName: 'asc' }, { version: 'desc' }],
    });

    return templates;
  }

  async removeItensFromChecklistTemplate(params: {
    templateId: string;
    templateItemIdsToRemove: string[];
  }): Promise<void> {
    const { templateId, templateItemIdsToRemove } = params;

    if (!templateItemIdsToRemove || templateItemIdsToRemove.length === 0) {
      throw new BadRequestException('Nenhum item para remover.');
    }

    await this.prisma.$transaction(async (tx) => {
      const currentTemplate = await tx.checklistTemplate.findUnique({
        where: { id: templateId },
        select: { checklistName: true, status: true },
      });

      if (!currentTemplate) {
        throw new BadRequestException('ChecklistTemplate não encontrado.');
      }

      const lastVersion = await tx.checklistTemplate.findFirst({
        where: { checklistName: currentTemplate.checklistName },
        orderBy: { version: 'desc' },
        select: { version: true },
      });

      const nextVersion = (lastVersion?.version ?? 0) + 1;

      const nextStatus =
        currentTemplate.status === ChecklistTemplateStatus.DRAFT
          ? ChecklistTemplateStatus.PUBLISHED
          : currentTemplate.status;

      const currentItems = await tx.checklistTemplateItem.findMany({
        where: { templateId },
        select: { id: true, atribute: true, required: true, sortOrder: true },
        orderBy: { sortOrder: 'asc' },
      });

      if (currentItems.length === 0) {
        throw new BadRequestException('Template sem itens.');
      }

      const currentIds = new Set(currentItems.map((i) => i.id));
      const missing = templateItemIdsToRemove.filter(
        (id) => !currentIds.has(id),
      );
      if (missing.length > 0) {
        throw new BadRequestException(
          `Itens não encontrados neste template: ${missing.join(', ')}`,
        );
      }

      const idsToRemove = new Set(templateItemIdsToRemove);
      const remainingItems = currentItems.filter((i) => !idsToRemove.has(i.id));

      if (remainingItems.length === 0) {
        throw new BadRequestException(
          'Não é permitido remover todos os itens do checklist.',
        );
      }

      const reindexed = remainingItems.map((item, idx) => ({
        ...item,
        sortOrder: idx + 1,
      }));

      const newTemplate = await tx.checklistTemplate.create({
        data: {
          checklistName: currentTemplate.checklistName,
          version: nextVersion,
          status: nextStatus,
          createdAt: new Date(),
        },
        select: { id: true },
      });

      await tx.checklistTemplateItem.createMany({
        data: reindexed.map((item) => ({
          templateId: newTemplate.id,
          atribute: item.atribute,
          required: item.required,
          sortOrder: item.sortOrder,
        })),
      });

      return { newTemplateId: newTemplate.id };
    });
  }

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
      throw new BadRequestException('A - Instance not found.');
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
      throw new BadRequestException('B - Instance not found.');
    }

    const checklistTemplate = await this.prisma.checklistTemplate.findUnique({
      where: { id: instance.templateId },
      select: { id: true, checklistName: true, version: true },
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
      version: checklistTemplate.version,
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
      throw new BadRequestException('C - Instance not found.');
    }

    const checklistTemplate = await this.prisma.checklistTemplate.findUnique({
      where: { id: instance.templateId },
      select: { id: true, checklistName: true, version: true },
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
      select: { id: true, templateItemId: true, value: true },
    });

    const instanceByTemplateItemId = new Map(
      instanceItems.map((ii) => [ii.templateItemId, ii]),
    );

    const items = templateItems.map((ti) => {
      const ii = instanceByTemplateItemId.get(ti.id);

      if (!ii) {
        throw new BadRequestException(
          `Instance item not found for templateItemId: ${ti.id}`,
        );
      }

      return {
        checklistInstanceItemId: ii.id,
        templateItemId: ti.id,
        atribute: ti.atribute,
        value: ii.value,
      };
    });

    return CompleteChecklist.create({
      templateId: checklistTemplate.id,
      version: checklistTemplate.version,
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
    if (checklistTemplateItem.length === 0) {
      throw new BadRequestException('Nenhum item informado.');
    }

    const originalTemplateId = checklistTemplateItem[0].templateId;

    const hasDifferentTemplateId = checklistTemplateItem.some(
      (i) => i.templateId !== originalTemplateId,
    );
    if (hasDifferentTemplateId) {
      throw new BadRequestException(
        'Todos os itens precisam pertencer ao mesmo templateId.',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      const currentTemplate = await tx.checklistTemplate.findUnique({
        where: { id: originalTemplateId },
        select: { checklistName: true, status: true },
      });

      if (!currentTemplate) {
        throw new BadRequestException('ChecklistTemplate não encontrado.');
      }

      const lastVersion = await tx.checklistTemplate.findFirst({
        where: { checklistName: currentTemplate.checklistName },
        orderBy: { version: 'desc' },
        select: { version: true },
      });

      const nextVersion = (lastVersion?.version ?? 0) + 1;

      const nextStatus =
        (currentTemplate.status as string) === 'DRAFT'
          ? ChecklistTemplateStatus.PUBLISHED
          : currentTemplate.status;

      const newTemplate = await tx.checklistTemplate.create({
        data: {
          checklistName: currentTemplate.checklistName,
          version: nextVersion,
          status: nextStatus,
          createdAt: new Date(),
        },
        select: { id: true },
      });

      await tx.checklistTemplateItem.createMany({
        data: checklistTemplateItem.map((item) => ({
          templateId: newTemplate.id,
          atribute: item.atribute,
          required: item.required,
          sortOrder: item.sortOrder,
        })),
      });
    });
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
