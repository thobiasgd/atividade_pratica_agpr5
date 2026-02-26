import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ChecklistTemplate } from '@/domain/entities/checklisttemplate';
import {
  ChecklistTemplate as PrismaChecklistTemplate,
  Prisma,
} from '@prisma/client';

export class PrismaChecklistTemplateMapper {
  static toDomain(raw: PrismaChecklistTemplate): ChecklistTemplate {
    return ChecklistTemplate.create(
      {
        checklistName: raw.checklistName,
        version: raw.version,
        status: raw.status,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    checklisttemplate: ChecklistTemplate,
  ): Prisma.ChecklistTemplateUncheckedCreateInput {
    return {
      id: checklisttemplate.id.toString(),
      checklistName: checklisttemplate.checklistName,
      version: checklisttemplate.version,
      status: checklisttemplate.status,
      createdAt: checklisttemplate.createdAt,
    };
  }
}
