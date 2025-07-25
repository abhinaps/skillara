export class FileSize {
  private static readonly MAX_SIZE = 5 * 1024 * 1024; // 5MB

  constructor(private readonly bytes: number) {
    if (bytes < 0) {
      throw new Error('File size cannot be negative');
    }
    if (bytes === 0) {
      throw new Error('File cannot be empty');
    }
    if (bytes > FileSize.MAX_SIZE) {
      throw new Error(`File size exceeds maximum allowed size of ${FileSize.MAX_SIZE} bytes`);
    }
  }

  getBytes(): number {
    return this.bytes;
  }

  getKilobytes(): number {
    return this.bytes / 1024;
  }

  getMegabytes(): number {
    return this.bytes / (1024 * 1024);
  }

  toString(): string {
    if (this.bytes < 1024) {
      return `${this.bytes} bytes`;
    } else if (this.bytes < 1024 * 1024) {
      return `${(this.bytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(this.bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  }

  static getMaxSize(): number {
    return FileSize.MAX_SIZE;
  }
}
