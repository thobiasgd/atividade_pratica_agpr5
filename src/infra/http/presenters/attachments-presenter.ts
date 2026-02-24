import { Attachment } from '@/domain/entities/attachment';

export class AttachmentPresenter {
  static toHTTP(attachment: Attachment) {
    return {
      title: attachment.title,
      url: attachment.url,
    };
  }
}
