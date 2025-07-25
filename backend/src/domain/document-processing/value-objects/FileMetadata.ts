import { FileSize } from './FileSize';
import { FileHash } from './FileHash';

export enum SupportedMimeType {
  PDF = 'application/pdf',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  DOC = 'application/msword',
  TXT = 'text/plain'
}

export class FileMetadata {
  constructor(
    private readonly originalName: string,
    private readonly mimeType: SupportedMimeType,
    private readonly size: FileSize,
    private readonly hash: FileHash,
    private readonly uploadedAt: Date = new Date()
  ) {
    this.validateFileName(originalName);
    this.validateMimeType(mimeType);
  }

  private validateFileName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('File name cannot be empty');
    }

    const maxLength = 255;
    if (name.length > maxLength) {
      throw new Error(`File name exceeds maximum length of ${maxLength} characters`);
    }

    // Check for potentially dangerous characters
    const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/;
    if (dangerousChars.test(name)) {
      throw new Error('File name contains invalid characters');
    }
  }

  private validateMimeType(mimeType: SupportedMimeType): void {
    const supportedTypes = Object.values(SupportedMimeType);
    if (!supportedTypes.includes(mimeType)) {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }
  }

  getOriginalName(): string {
    return this.originalName;
  }

  getMimeType(): SupportedMimeType {
    return this.mimeType;
  }

  getSize(): FileSize {
    return this.size;
  }

  getHash(): FileHash {
    return this.hash;
  }

  getUploadedAt(): Date {
    return new Date(this.uploadedAt);
  }

  getFileExtension(): string {
    switch (this.mimeType) {
      case SupportedMimeType.PDF:
        return '.pdf';
      case SupportedMimeType.DOCX:
        return '.docx';
      case SupportedMimeType.DOC:
        return '.doc';
      default:
        return '';
    }
  }

  isPdf(): boolean {
    return this.mimeType === SupportedMimeType.PDF;
  }

  isWordDocument(): boolean {
    return this.mimeType === SupportedMimeType.DOCX || this.mimeType === SupportedMimeType.DOC;
  }
}
