import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ChecklistInstanceItem } from '@/domain/entities/checklistinstanceitem';
import {
  ChecklistInstanceItem as PrismaChecklistInstanceItem,
  Prisma,
} from '@prisma/client';

export class PrismaChecklistInstanceItemMapper {
  static toDomain(raw: PrismaChecklistInstanceItem): ChecklistInstanceItem {
    return ChecklistInstanceItem.create(
      {
        instanceId: new UniqueEntityID(raw.instanceId),
        templateItemId: new UniqueEntityID(raw.templateItemId),
        value: raw.value,
        //checkedByUserId: new UniqueEntityID(raw.checkedByUserId),
        checkedAt: raw.checkedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    checklistinstanceitem: ChecklistInstanceItem,
  ): Prisma.ChecklistInstanceItemUncheckedCreateInput {
    return {
      id: checklistinstanceitem.id.toString(),
      instanceId: checklistinstanceitem.instanceId.toString(),
      templateItemId: checklistinstanceitem.templateItemId.toString(),
      value: checklistinstanceitem.value,
      //checkedByUserId: checklistinstanceitem.checkedByUserId.toString(),
      checkedAt: checklistinstanceitem.checkedAt,
    };
  }
}
