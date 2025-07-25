import { v4 as uuidv4 } from 'uuid';

export class FileHash {
  constructor(private readonly value: string) {
    if (!value || value.length === 0) {
      throw new Error('File hash cannot be empty');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: FileHash): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
