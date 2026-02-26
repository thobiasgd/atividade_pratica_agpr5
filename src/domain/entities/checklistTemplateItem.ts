import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export type OrderStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface ChecklistTemplateItemProps {
  templateId: UniqueEntityID;
  atribute: string;
  required: boolean;
  sortOrder: number;
}

export class ChecklistTemplateItem extends Entity<ChecklistTemplateItemProps> {
  get templateId() {
    return this.props.templateId;
  }

  get atribute() {
    return this.props.atribute;
  }

  get required() {
    return this.props.required;
  }

  get sortOrder() {
    return this.props.sortOrder;
  }

  static create(props: ChecklistTemplateItemProps, id?: UniqueEntityID) {
    const checklisttemplateitem = new ChecklistTemplateItem(props, id);

    return checklisttemplateitem;
  }
}
