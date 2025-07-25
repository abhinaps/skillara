import { DomainEvent } from './DocumentUploaded';

export class DocumentValidated implements DomainEvent {
  public readonly eventType = 'DocumentValidated';
  public readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly eventData: {
      isValid: boolean;
      validationErrors?: string[];
      fileHash: string;
    }
  ) {
    this.occurredOn = new Date();
  }
}
