import { v4 as uuidv4 } from 'uuid';
import { FileMetadata, SupportedMimeType } from '../value-objects/FileMetadata';
import { FileSize } from '../value-objects/FileSize';
import { FileHash } from '../value-objects/FileHash';
import { DocumentUploaded } from '../events/DocumentUploaded';
import { DocumentValidated } from '../events/DocumentValidated';
import { DocumentRejected } from '../events/DocumentRejected';
import { DomainEvent } from '../events/DocumentUploaded';

export enum DocumentStatus {
  UPLOADED = 'uploaded',
  VALIDATED = 'validated',
  PROCESSING = 'processing',
  PROCESSED = 'processed',
  FAILED = 'failed'
}

export class ResumeDocument {
  private domainEvents: DomainEvent[] = [];

  constructor(
    private readonly id: string,
    private readonly metadata: FileMetadata,
    private readonly storagePath: string,
    private status: DocumentStatus = DocumentStatus.UPLOADED,
    private readonly sessionId?: string,
    private validationErrors: string[] = [],
    private readonly createdAt: Date = new Date()
  ) {
    // Raise domain event for new document upload
    this.addDomainEvent(new DocumentUploaded(this.id, {
      originalName: metadata.getOriginalName(),
      mimeType: metadata.getMimeType(),
      size: metadata.getSize().getBytes(),
      sessionId: this.sessionId
    }));
  }

  static create(
    originalName: string,
    mimeType: SupportedMimeType,
    size: number,
    fileBuffer: Buffer,
    storagePath: string,
    sessionId?: string
  ): ResumeDocument {
    const id = uuidv4();
    const fileHash = new FileHash(this.generateHash(fileBuffer));
    const fileSize = new FileSize(size);
    const metadata = new FileMetadata(originalName, mimeType, fileSize, fileHash);

    return new ResumeDocument(id, metadata, storagePath, DocumentStatus.UPLOADED, sessionId);
  }

  private static generateHash(buffer: Buffer): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  // Business logic methods
  validate(): boolean {
    const errors: string[] = [];

    // Validate file size
    try {
      // Size validation is already done in FileSize constructor
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Invalid file size');
    }

    // Validate file type
    if (!Object.values(SupportedMimeType).includes(this.metadata.getMimeType())) {
      errors.push('Unsupported file type');
    }

    // Check for duplicate (business rule: same hash shouldn't be processed multiple times)
    // This would typically involve checking against a repository

    this.validationErrors = errors;

    if (errors.length === 0) {
      this.status = DocumentStatus.VALIDATED;
      this.addDomainEvent(new DocumentValidated(this.id, {
        isValid: true,
        fileHash: this.metadata.getHash().getValue()
      }));
      return true;
    } else {
      this.status = DocumentStatus.FAILED;
      this.addDomainEvent(new DocumentRejected(this.id, {
        reason: 'Validation failed',
        validationErrors: errors,
        originalName: this.metadata.getOriginalName()
      }));
      return false;
    }
  }

  markAsProcessing(): void {
    if (this.status !== DocumentStatus.VALIDATED) {
      throw new Error('Document must be validated before processing');
    }
    this.status = DocumentStatus.PROCESSING;
  }

  markAsProcessed(): void {
    if (this.status !== DocumentStatus.PROCESSING) {
      throw new Error('Document must be in processing state to mark as processed');
    }
    this.status = DocumentStatus.PROCESSED;
  }

  markAsFailed(reason: string): void {
    this.status = DocumentStatus.FAILED;
    this.validationErrors.push(reason);
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getMetadata(): FileMetadata {
    return this.metadata;
  }

  getStoragePath(): string {
    return this.storagePath;
  }

  getStatus(): DocumentStatus {
    return this.status;
  }

  getSessionId(): string | undefined {
    return this.sessionId;
  }

  getValidationErrors(): string[] {
    return [...this.validationErrors];
  }

  getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  isValid(): boolean {
    return this.status !== DocumentStatus.FAILED && this.validationErrors.length === 0;
  }

  canBeProcessed(): boolean {
    return this.status === DocumentStatus.VALIDATED;
  }

  isProcessed(): boolean {
    return this.status === DocumentStatus.PROCESSED;
  }

  // Domain events handling
  private addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }

  // For deduplication
  hasSameContent(other: ResumeDocument): boolean {
    return this.metadata.getHash().equals(other.metadata.getHash());
  }
}
