import { DomainEvent } from './DocumentUploaded';

export class DocumentRejected implements DomainEvent {
  public readonly eventType = 'DocumentRejected';
  public readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly eventData: {
      reason: string;
      validationErrors: string[];
      originalName: string;
    }
  ) {
    this.occurredOn = new Date();
  }
}
