import { z } from 'zod';

/**
 * Base Entity class that all domain entities should extend
 * Provides common functionality for identity and domain events
 */
export abstract class Entity<T> {
  protected readonly _id: T;
  private _domainEvents: DomainEvent[] = [];

  constructor(id: T) {
    this._id = id;
  }

  get id(): T {
    return this._id;
  }

  get domainEvents(): DomainEvent[] {
    return this._domainEvents.slice(); // Return copy to prevent external mutation
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  public clearDomainEvents(): void {
    this._domainEvents = [];
  }

  /**
   * Entities are equal if they have the same identity
   */
  public equals(other: Entity<T>): boolean {
    if (!(other instanceof Entity)) {
      return false;
    }
    return this._id === other._id;
  }
}

/**
 * Aggregate Root extends Entity and provides additional functionality
 * for managing consistency boundaries and domain events
 */
export abstract class AggregateRoot<T> extends Entity<T> {
  /**
   * Mark aggregate as modified and add domain event
   */
  protected markModified(event: DomainEvent): void {
    this.addDomainEvent(event);
  }

  /**
   * Get uncommitted domain events and clear them
   */
  public getUncommittedEvents(): DomainEvent[] {
    const events = this.domainEvents;
    this.clearDomainEvents();
    return events;
  }
}

/**
 * Base interface for all domain events
 */
export interface DomainEvent {
  readonly eventId: string;
  readonly aggregateId: string;
  readonly eventType: string;
  readonly occurredOn: Date;
  readonly eventVersion: number;
}

/**
 * Abstract base class for domain events
 */
export abstract class BaseDomainEvent implements DomainEvent {
  public readonly eventId: string;
  public readonly aggregateId: string;
  public readonly eventType: string;
  public readonly occurredOn: Date;
  public readonly eventVersion: number;

  constructor(aggregateId: string, eventType: string, eventVersion: number = 1) {
    this.eventId = crypto.randomUUID();
    this.aggregateId = aggregateId;
    this.eventType = eventType;
    this.occurredOn = new Date();
    this.eventVersion = eventVersion;
  }
}

/**
 * Value Object base class
 * Value objects are immutable and identified by their attributes
 */
export abstract class ValueObject<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this._value = Object.freeze(value);
  }

  get value(): T {
    return this._value;
  }

  /**
   * Value objects are equal if their values are equal
   */
  public equals(other: ValueObject<T>): boolean {
    if (!(other instanceof ValueObject)) {
      return false;
    }
    return JSON.stringify(this._value) === JSON.stringify(other._value);
  }

  /**
   * Get the primitive value for serialization
   */
  public toValue(): T {
    return this._value;
  }
}

/**
 * Result type for operations that can succeed or fail
 */
export class Result<T, E = Error> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _value?: T,
    private readonly _error?: E
  ) {}

  public static success<T, E = Error>(value: T): Result<T, E> {
    return new Result<T, E>(true, value);
  }

  public static failure<T, E = Error>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  get isSuccess(): boolean {
    return this._isSuccess;
  }

  get isFailure(): boolean {
    return !this._isSuccess;
  }

  get value(): T {
    if (!this._isSuccess) {
      throw new Error('Cannot get value from failed result');
    }
    return this._value!;
  }

  get error(): E {
    if (this._isSuccess) {
      throw new Error('Cannot get error from successful result');
    }
    return this._error!;
  }
}

/**
 * Domain Error base class
 */
export abstract class DomainError extends Error {
  public readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = this.constructor.name;
  }
}

/**
 * Specification pattern for business rules
 */
export abstract class Specification<T> {
  abstract isSatisfiedBy(target: T): boolean;

  and(other: Specification<T>): Specification<T> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<T>): Specification<T> {
    return new OrSpecification(this, other);
  }

  not(): Specification<T> {
    return new NotSpecification(this);
  }
}

class AndSpecification<T> extends Specification<T> {
  constructor(
    private left: Specification<T>,
    private right: Specification<T>
  ) {
    super();
  }

  isSatisfiedBy(target: T): boolean {
    return this.left.isSatisfiedBy(target) && this.right.isSatisfiedBy(target);
  }
}

class OrSpecification<T> extends Specification<T> {
  constructor(
    private left: Specification<T>,
    private right: Specification<T>
  ) {
    super();
  }

  isSatisfiedBy(target: T): boolean {
    return this.left.isSatisfiedBy(target) || this.right.isSatisfiedBy(target);
  }
}

class NotSpecification<T> extends Specification<T> {
  constructor(private spec: Specification<T>) {
    super();
  }

  isSatisfiedBy(target: T): boolean {
    return !this.spec.isSatisfiedBy(target);
  }
}
