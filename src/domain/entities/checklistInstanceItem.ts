import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export type OrderStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface ChecklistInstanceItemProps {
  instanceId: UniqueEntityID;
  templateItemId: UniqueEntityID;
  value: boolean;
  //checkedByUserId: UniqueEntityID;
  checkedAt: Date | null;
}

export class ChecklistInstanceItem extends Entity<ChecklistInstanceItemProps> {
  get instanceId() {
    return this.props.instanceId;
  }

  get templateItemId() {
    return this.props.templateItemId;
  }

  get value() {
    return this.props.value;
  }

  get checkedAt() {
    return this.props.checkedAt;
  }

  static create(props: ChecklistInstanceItemProps, id?: UniqueEntityID) {
    const checklistinstanceitem = new ChecklistInstanceItem(props, id);

    return checklistinstanceitem;
  }
}
