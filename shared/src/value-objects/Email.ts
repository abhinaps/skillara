import { z } from 'zod';

export const EmailSchema = z.string().email();

export class Email {
  private readonly _value: string;

  constructor(value: string) {
    const result = EmailSchema.safeParse(value);
    if (!result.success) {
      throw new Error(`Invalid Email: ${value}`);
    }
    this._value = value.toLowerCase().trim();
  }

  static fromString(value: string): Email {
    return new Email(value);
  }

  get value(): string {
    return this._value;
  }

  get domain(): string {
    return this._value.split('@')[1] ?? '';
  }

  get localPart(): string {
    return this._value.split('@')[0] ?? '';
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  toJSON(): string {
    return this._value;
  }
}
