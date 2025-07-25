import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { IFileStorageService, FileStorageResult } from './IFileStorageService';

export class LocalFileStorageService implements IFileStorageService {
  private readonly baseDirectory: string;

  constructor(baseDirectory: string = './uploads/documents') {
    this.baseDirectory = path.resolve(baseDirectory);
    this.ensureDirectoryExists();
  }

  private async ensureDirectoryExists(): Promise<void> {
    try {
      await fs.access(this.baseDirectory);
    } catch {
      await fs.mkdir(this.baseDirectory, { recursive: true });
    }
  }

  async store(buffer: Buffer, fileName: string, mimeType: string): Promise<FileStorageResult> {
    try {
      await this.ensureDirectoryExists();

      // Generate unique file name to prevent conflicts
      const extension = this.getExtensionFromMimeType(mimeType);
      const uniqueFileName = `${uuidv4()}${extension}`;
      const filePath = path.join(this.baseDirectory, uniqueFileName);

      await fs.writeFile(filePath, buffer);

      return {
        success: true,
        filePath: uniqueFileName // Return relative path
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown storage error'
      };
    }
  }

  async retrieve(filePath: string): Promise<Buffer> {
    const fullPath = path.join(this.baseDirectory, filePath);
    return await fs.readFile(fullPath);
  }

  async delete(filePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(this.baseDirectory, filePath);
      await fs.unlink(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(this.baseDirectory, filePath);
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  getUrl(filePath: string): string {
    // For local storage, this would typically be a server URL
    // For now, return the file path
    return `/uploads/documents/${filePath}`;
  }

  private getExtensionFromMimeType(mimeType: string): string {
    switch (mimeType) {
      case 'application/pdf':
        return '.pdf';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return '.docx';
      case 'application/msword':
        return '.doc';
      default:
        return '.bin';
    }
  }

  // Utility method to clean up old files
  async cleanupOldFiles(maxAgeHours: number = 24): Promise<number> {
    try {
      const files = await fs.readdir(this.baseDirectory);
      const maxAge = Date.now() - (maxAgeHours * 60 * 60 * 1000);
      let deletedCount = 0;

      for (const file of files) {
        const filePath = path.join(this.baseDirectory, file);
        const stats = await fs.stat(filePath);

        if (stats.mtime.getTime() < maxAge) {
          await fs.unlink(filePath);
          deletedCount++;
        }
      }

      return deletedCount;
    } catch {
      return 0;
    }
  }
}
