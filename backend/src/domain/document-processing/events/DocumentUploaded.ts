export interface DomainEvent {
  eventType: string;
  aggregateId: string;
  occurredOn: Date;
  eventData: any;
}

export class DocumentUploaded implements DomainEvent {
  public readonly eventType = 'DocumentUploaded';
  public readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly eventData: {
      originalName: string;
      mimeType: string;
      size: number;
      sessionId?: string;
    }
  ) {
    this.occurredOn = new Date();
  }
}
