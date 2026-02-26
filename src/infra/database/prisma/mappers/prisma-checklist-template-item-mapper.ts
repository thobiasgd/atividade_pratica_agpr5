import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ChecklistTemplateItem } from '@/domain/entities/checklisttemplateitem';
import {
  ChecklistTemplateItem as PrismaChecklistTemplateItem,
  Prisma,
} from '@prisma/client';

export class PrismaChecklistTemplateItemMapper {
  static toDomain(raw: PrismaChecklistTemplateItem): ChecklistTemplateItem {
    return ChecklistTemplateItem.create(
      {
        templateId: new UniqueEntityID(raw.templateId),
        atribute: raw.atribute,
        required: raw.required,
        sortOrder: raw.sortOrder,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    checklisttemplateitem: ChecklistTemplateItem,
  ): Prisma.ChecklistTemplateItemUncheckedCreateInput {
    return {
      id: checklisttemplateitem.id.toString(),
      templateId: checklisttemplateitem.templateId.toString(),
      atribute: checklisttemplateitem.atribute,
      required: checklisttemplateitem.required,
      sortOrder: checklisttemplateitem.sortOrder,
    };
  }
}
