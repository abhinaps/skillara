import { SupportedMimeType } from '../../domain/document-processing/value-objects/FileMetadata';

export interface FileValidationResult {
  isValid: boolean;
  detectedMimeType?: string;
  errors: string[];
}

export class FileValidator {
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly SUPPORTED_MIME_TYPES = Object.values(SupportedMimeType);

  static async validateFile(
    buffer: Buffer,
    originalName: string,
    reportedMimeType: string
  ): Promise<FileValidationResult> {
    const errors: string[] = [];

    // Check file size
    if (buffer.length === 0) {
      errors.push('File is empty');
    } else if (buffer.length > this.MAX_FILE_SIZE) {
      errors.push(`File size exceeds maximum limit of ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    // Detect actual file type from content
    let detectedMimeType: string | undefined;
    try {
      const { fileTypeFromBuffer } = await import('file-type');
      const fileTypeResult = await fileTypeFromBuffer(buffer);
      detectedMimeType = fileTypeResult?.mime;

      // If file-type couldn't detect it, check if it's a text file based on the reported MIME type
      if (!detectedMimeType && reportedMimeType === 'text/plain') {
        // Check if buffer contains mostly text
        const text = buffer.toString('utf8', 0, Math.min(1024, buffer.length));
        const isText = /^[\s\x20-\x7E\u00A0-\u024F\u1E00-\u1EFF]*$/.test(text);
        if (isText) {
          detectedMimeType = 'text/plain';
        }
      }
    } catch (error) {
      console.warn('File type detection failed:', error);
      // If detection fails but we have a reported MIME type, try to use it
      if (this.SUPPORTED_MIME_TYPES.includes(reportedMimeType as SupportedMimeType)) {
        detectedMimeType = reportedMimeType;
      }
    }

    // Validate file type
    if (!detectedMimeType) {
      errors.push('Could not determine file type');
    } else if (!this.SUPPORTED_MIME_TYPES.includes(detectedMimeType as SupportedMimeType)) {
      errors.push(`Unsupported file type: ${detectedMimeType}`);
    }

    // Check mime type consistency (reported vs detected)
    if (detectedMimeType && reportedMimeType !== detectedMimeType) {
      // Some browsers might report different MIME types, so we'll use detected type
      console.warn(`MIME type mismatch: reported=${reportedMimeType}, detected=${detectedMimeType}`);
    }

    // Validate file name
    if (!originalName || originalName.trim().length === 0) {
      errors.push('File name is required');
    } else {
      const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
      if (invalidChars.test(originalName)) {
        errors.push('File name contains invalid characters');
      }

      if (originalName.length > 255) {
        errors.push('File name is too long (maximum 255 characters)');
      }
    }

    // Content-specific validation
    if (detectedMimeType && errors.length === 0) {
      const contentValidation = await this.validateFileContent(buffer, detectedMimeType as SupportedMimeType);
      errors.push(...contentValidation);
    }

    return {
      isValid: errors.length === 0,
      detectedMimeType,
      errors
    };
  }

  private static async validateFileContent(
    buffer: Buffer,
    mimeType: SupportedMimeType
  ): Promise<string[]> {
    const errors: string[] = [];

    try {
      switch (mimeType) {
        case SupportedMimeType.PDF:
          await this.validatePdfContent(buffer);
          break;
        case SupportedMimeType.DOCX:
        case SupportedMimeType.DOC:
          await this.validateWordContent(buffer);
          break;
        case SupportedMimeType.TXT:
          // For text files, just check if it's valid UTF-8
          try {
            buffer.toString('utf8');
          } catch {
            errors.push('Text file contains invalid UTF-8 encoding');
          }
          break;
      }
    } catch (error) {
      errors.push(`File appears to be corrupted: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return errors;
  }

  private static async validatePdfContent(buffer: Buffer): Promise<void> {
    // Basic PDF signature check
    const pdfHeader = buffer.subarray(0, 4).toString('ascii');
    if (pdfHeader !== '%PDF') {
      throw new Error('Invalid PDF file format');
    }

    // Check for minimum PDF content
    if (buffer.length < 100) {
      throw new Error('PDF file appears to be too small to contain meaningful content');
    }
  }

  private static async validateWordContent(buffer: Buffer): Promise<void> {
    // For DOCX files, check ZIP signature (DOCX is essentially a ZIP file)
    if (buffer.length >= 4) {
      const zipSignature = buffer.subarray(0, 4);
      const isZip = zipSignature[0] === 0x50 && zipSignature[1] === 0x4B;

      if (!isZip) {
        throw new Error('Invalid Word document format');
      }
    }

    if (buffer.length < 1000) {
      throw new Error('Word document appears to be too small to contain meaningful content');
    }
  }

  static sanitizeFileName(fileName: string): string {
    // Remove invalid characters and limit length
    return fileName
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
      .substring(0, 255)
      .trim();
  }

  static isValidMimeType(mimeType: string): mimeType is SupportedMimeType {
    return this.SUPPORTED_MIME_TYPES.includes(mimeType as SupportedMimeType);
  }
}
