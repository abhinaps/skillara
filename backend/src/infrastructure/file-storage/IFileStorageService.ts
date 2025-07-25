export interface FileStorageResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

export interface IFileStorageService {
  store(buffer: Buffer, fileName: string, mimeType: string): Promise<FileStorageResult>;
  retrieve(filePath: string): Promise<Buffer>;
  delete(filePath: string): Promise<boolean>;
  exists(filePath: string): Promise<boolean>;
  getUrl(filePath: string): string;
}
