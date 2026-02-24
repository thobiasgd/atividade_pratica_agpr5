import { Attachment } from '../entities/attachment';

export abstract class AttachmentsRepository {
  abstract create(attachment: Attachment): Promise<void>;
  abstract fetchListOfAttachments(orderId: string): Promise<Attachment[]>;
  abstract delete(attachment: Attachment): Promise<void>;
  abstract findById(url: string): Promise<Attachment | null>;
}
