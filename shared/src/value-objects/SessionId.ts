import { z } from 'zod';

export const SessionIdSchema = z.string().uuid();

export class SessionId {
  private readonly _value: string;

  constructor(value: string) {
    const result = SessionIdSchema.safeParse(value);
    if (!result.success) {
      throw new Error(`Invalid SessionId: ${value}`);
    }
    this._value = value;
  }

  static generate(): SessionId {
    return new SessionId(crypto.randomUUID());
  }

  static fromString(value: string): SessionId {
    return new SessionId(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: SessionId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  toJSON(): string {
    return this._value;
  }
}
