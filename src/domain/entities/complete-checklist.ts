import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export type CompleteChecklistStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface CompleteChecklistProps {
  templateId: string;
  checklistName: string;
  items: {
    templateItemId: string;
    atribute: string;
    value: boolean;
  }[];
}

export class CompleteChecklist extends Entity<CompleteChecklistProps> {
  get templateId() {
    return this.props.templateId;
  }

  get checklistName() {
    return this.props.checklistName;
  }

  get items() {
    return this.props.items;
  }

  static create(props: CompleteChecklistProps, id?: UniqueEntityID) {
    const completeChecklist = new CompleteChecklist(props, id);

    return completeChecklist;
  }
}
