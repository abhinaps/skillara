import { z } from 'zod';
import { ValueObject, DomainError } from '../base-entities';

/**
 * Email value object with validation
 */
export class Email extends ValueObject<string> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(email: string) {
    super(email.toLowerCase().trim());
  }

  public static create(email: string): Email {
    if (!email || typeof email !== 'string') {
      throw new InvalidEmailError('Email cannot be empty');
    }

    const trimmedEmail = email.toLowerCase().trim();

    if (!this.EMAIL_REGEX.test(trimmedEmail)) {
      throw new InvalidEmailError('Invalid email format');
    }

    if (trimmedEmail.length > 254) {
      throw new InvalidEmailError('Email too long (max 254 characters)');
    }

    return new Email(trimmedEmail);
  }

  public getDomain(): string {
    return this._value.split('@')[1];
  }

  public getLocalPart(): string {
    return this._value.split('@')[0];
  }
}

/**
 * UUID value object with validation
 */
export class UniqueId extends ValueObject<string> {
  private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  private constructor(id: string) {
    super(id);
  }

  public static create(id?: string): UniqueId {
    if (!id) {
      return new UniqueId(crypto.randomUUID());
    }

    if (!this.UUID_REGEX.test(id)) {
      throw new InvalidIdError('Invalid UUID format');
    }

    return new UniqueId(id);
  }

  public static generate(): UniqueId {
    return new UniqueId(crypto.randomUUID());
  }
}

/**
 * Date range value object
 */
export class DateRange extends ValueObject<{ from: Date; to: Date }> {
  private constructor(from: Date, to: Date) {
    if (from >= to) {
      throw new InvalidDateRangeError('From date must be before to date');
    }
    super({ from, to });
  }

  public static create(from: Date, to: Date): DateRange {
    return new DateRange(from, to);
  }

  public static createFromStrings(from: string, to: string): DateRange {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new InvalidDateRangeError('Invalid date format');
    }

    return new DateRange(fromDate, toDate);
  }

  get from(): Date {
    return this._value.from;
  }

  get to(): Date {
    return this._value.to;
  }

  public getDurationInDays(): number {
    return Math.ceil((this._value.to.getTime() - this._value.from.getTime()) / (1000 * 60 * 60 * 24));
  }

  public contains(date: Date): boolean {
    return date >= this._value.from && date <= this._value.to;
  }

  public overlaps(other: DateRange): boolean {
    return this._value.from <= other.to && this._value.to >= other.from;
  }
}

/**
 * Money value object for handling currency
 */
export class Money extends ValueObject<{ amount: number; currency: string }> {
  private static readonly SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];

  private constructor(amount: number, currency: string) {
    super({ amount: Math.round(amount * 100) / 100, currency: currency.toUpperCase() });
  }

  public static create(amount: number, currency: string): Money {
    if (amount < 0) {
      throw new InvalidMoneyError('Amount cannot be negative');
    }

    if (!this.SUPPORTED_CURRENCIES.includes(currency.toUpperCase())) {
      throw new InvalidMoneyError(`Unsupported currency: ${currency}`);
    }

    return new Money(amount, currency);
  }

  get amount(): number {
    return this._value.amount;
  }

  get currency(): string {
    return this._value.currency;
  }

  public add(other: Money): Money {
    if (this._value.currency !== other._value.currency) {
      throw new InvalidMoneyError('Cannot add money with different currencies');
    }
    return new Money(this._value.amount + other._value.amount, this._value.currency);
  }

  public subtract(other: Money): Money {
    if (this._value.currency !== other._value.currency) {
      throw new InvalidMoneyError('Cannot subtract money with different currencies');
    }
    const result = this._value.amount - other._value.amount;
    if (result < 0) {
      throw new InvalidMoneyError('Subtraction would result in negative amount');
    }
    return new Money(result, this._value.currency);
  }

  public multiply(factor: number): Money {
    if (factor < 0) {
      throw new InvalidMoneyError('Cannot multiply by negative factor');
    }
    return new Money(this._value.amount * factor, this._value.currency);
  }

  public isGreaterThan(other: Money): boolean {
    if (this._value.currency !== other._value.currency) {
      throw new InvalidMoneyError('Cannot compare money with different currencies');
    }
    return this._value.amount > other._value.amount;
  }

  public isLessThan(other: Money): boolean {
    if (this._value.currency !== other._value.currency) {
      throw new InvalidMoneyError('Cannot compare money with different currencies');
    }
    return this._value.amount < other._value.amount;
  }

  public equals(other: Money): boolean {
    return this._value.amount === other._value.amount &&
           this._value.currency === other._value.currency;
  }

  public toString(): string {
    return `${this._value.amount} ${this._value.currency}`;
  }
}

/**
 * Percentage value object
 */
export class Percentage extends ValueObject<number> {
  private constructor(value: number) {
    super(Math.round(value * 100) / 100); // Round to 2 decimal places
  }

  public static create(value: number): Percentage {
    if (value < 0 || value > 100) {
      throw new InvalidPercentageError('Percentage must be between 0 and 100');
    }
    return new Percentage(value);
  }

  public static fromDecimal(decimal: number): Percentage {
    if (decimal < 0 || decimal > 1) {
      throw new InvalidPercentageError('Decimal must be between 0 and 1');
    }
    return new Percentage(decimal * 100);
  }

  public toDecimal(): number {
    return this._value / 100;
  }

  public toString(): string {
    return `${this._value}%`;
  }
}

/**
 * URL value object with validation
 */
export class Url extends ValueObject<string> {
  private constructor(url: string) {
    super(url);
  }

  public static create(url: string): Url {
    try {
      // This will throw if URL is invalid
      new URL(url);
      return new Url(url);
    } catch (error) {
      throw new InvalidUrlError('Invalid URL format');
    }
  }

  public getDomain(): string {
    return new URL(this._value).hostname;
  }

  public getProtocol(): string {
    return new URL(this._value).protocol;
  }

  public getPath(): string {
    return new URL(this._value).pathname;
  }
}

// Domain Errors
export class InvalidEmailError extends DomainError {
  constructor(message: string) {
    super(message, 'INVALID_EMAIL');
  }
}

export class InvalidIdError extends DomainError {
  constructor(message: string) {
    super(message, 'INVALID_ID');
  }
}

export class InvalidDateRangeError extends DomainError {
  constructor(message: string) {
    super(message, 'INVALID_DATE_RANGE');
  }
}

export class InvalidMoneyError extends DomainError {
  constructor(message: string) {
    super(message, 'INVALID_MONEY');
  }
}

export class InvalidPercentageError extends DomainError {
  constructor(message: string) {
    super(message, 'INVALID_PERCENTAGE');
  }
}

export class InvalidUrlError extends DomainError {
  constructor(message: string) {
    super(message, 'INVALID_URL');
  }
}
