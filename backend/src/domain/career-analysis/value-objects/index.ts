import { z } from 'zod';
import { ValueObject, DomainError } from '../../shared/base-entities';
import { UniqueId } from '../../shared/value-objects';

/**
 * Skill ID value object
 */
export class SkillId extends ValueObject<string> {
  private constructor(id: string) {
    super(id);
  }

  public static create(id: string): SkillId {
    if (!id || typeof id !== 'string') {
      throw new InvalidSkillIdError('Skill ID cannot be empty');
    }
    return new SkillId(id);
  }

  public static generate(): SkillId {
    return new SkillId(crypto.randomUUID());
  }
}

/**
 * Skill Name value object with validation
 */
export class SkillName extends ValueObject<string> {
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 100;

  private constructor(name: string) {
    super(name.trim());
  }

  public static create(name: string): SkillName {
    if (!name || typeof name !== 'string') {
      throw new InvalidSkillNameError('Skill name cannot be empty');
    }

    const trimmedName = name.trim();

    if (trimmedName.length < this.MIN_LENGTH) {
      throw new InvalidSkillNameError(`Skill name must be at least ${this.MIN_LENGTH} characters`);
    }

    if (trimmedName.length > this.MAX_LENGTH) {
      throw new InvalidSkillNameError(`Skill name cannot exceed ${this.MAX_LENGTH} characters`);
    }

    // Basic validation for skill names (letters, numbers, spaces, hyphens, dots)
    const validNameRegex = /^[a-zA-Z0-9\s\-\.]+$/;
    if (!validNameRegex.test(trimmedName)) {
      throw new InvalidSkillNameError('Skill name contains invalid characters');
    }

    return new SkillName(trimmedName);
  }

  public toSlug(): string {
    return this._value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

/**
 * Skill Level value object (1-5 scale)
 */
export class SkillLevel extends ValueObject<number> {
  public static readonly BEGINNER = 1;
  public static readonly NOVICE = 2;
  public static readonly INTERMEDIATE = 3;
  public static readonly ADVANCED = 4;
  public static readonly EXPERT = 5;

  private static readonly LEVEL_NAMES: Record<number, string> = {
    [SkillLevel.BEGINNER]: 'Beginner',
    [SkillLevel.NOVICE]: 'Novice',
    [SkillLevel.INTERMEDIATE]: 'Intermediate',
    [SkillLevel.ADVANCED]: 'Advanced',
    [SkillLevel.EXPERT]: 'Expert'
  };

  private constructor(level: number) {
    super(level);
  }

  public static create(level: number): SkillLevel {
    if (!Number.isInteger(level) || level < 1 || level > 5) {
      throw new InvalidSkillLevelError('Skill level must be an integer between 1 and 5');
    }
    return new SkillLevel(level);
  }

  public static beginner(): SkillLevel {
    return new SkillLevel(this.BEGINNER);
  }

  public static novice(): SkillLevel {
    return new SkillLevel(this.NOVICE);
  }

  public static intermediate(): SkillLevel {
    return new SkillLevel(this.INTERMEDIATE);
  }

  public static advanced(): SkillLevel {
    return new SkillLevel(this.ADVANCED);
  }

  public static expert(): SkillLevel {
    return new SkillLevel(this.EXPERT);
  }

  public getName(): string {
    return SkillLevel.LEVEL_NAMES[this._value];
  }

  public isBeginner(): boolean {
    return this._value === SkillLevel.BEGINNER;
  }

  public isExpert(): boolean {
    return this._value === SkillLevel.EXPERT;
  }

  public isAtLeast(other: SkillLevel): boolean {
    return this._value >= other._value;
  }

  public isBelow(other: SkillLevel): boolean {
    return this._value < other._value;
  }

  public getNext(): SkillLevel | null {
    if (this._value >= 5) return null;
    return new SkillLevel(this._value + 1);
  }

  public getPrevious(): SkillLevel | null {
    if (this._value <= 1) return null;
    return new SkillLevel(this._value - 1);
  }

  public toString(): string {
    return `${this._value} (${this.getName()})`;
  }
}

/**
 * Experience Level value object
 */
export class ExperienceLevel extends ValueObject<string> {
  public static readonly ENTRY_LEVEL = 'entry-level';
  public static readonly JUNIOR = 'junior';
  public static readonly MID_LEVEL = 'mid-level';
  public static readonly SENIOR = 'senior';
  public static readonly LEAD = 'lead';
  public static readonly PRINCIPAL = 'principal';

  private static readonly VALID_LEVELS = [
    ExperienceLevel.ENTRY_LEVEL,
    ExperienceLevel.JUNIOR,
    ExperienceLevel.MID_LEVEL,
    ExperienceLevel.SENIOR,
    ExperienceLevel.LEAD,
    ExperienceLevel.PRINCIPAL
  ];

  private static readonly LEVEL_HIERARCHY: Record<string, number> = {
    [ExperienceLevel.ENTRY_LEVEL]: 1,
    [ExperienceLevel.JUNIOR]: 2,
    [ExperienceLevel.MID_LEVEL]: 3,
    [ExperienceLevel.SENIOR]: 4,
    [ExperienceLevel.LEAD]: 5,
    [ExperienceLevel.PRINCIPAL]: 6
  };

  private static readonly LEVEL_NAMES: Record<string, string> = {
    [ExperienceLevel.ENTRY_LEVEL]: 'Entry Level',
    [ExperienceLevel.JUNIOR]: 'Junior',
    [ExperienceLevel.MID_LEVEL]: 'Mid-Level',
    [ExperienceLevel.SENIOR]: 'Senior',
    [ExperienceLevel.LEAD]: 'Lead',
    [ExperienceLevel.PRINCIPAL]: 'Principal'
  };

  private constructor(level: string) {
    super(level);
  }

  public static create(level: string): ExperienceLevel {
    if (!level || typeof level !== 'string') {
      throw new InvalidExperienceLevelError('Experience level cannot be empty');
    }

    const normalizedLevel = level.toLowerCase().trim();

    if (!this.VALID_LEVELS.includes(normalizedLevel)) {
      throw new InvalidExperienceLevelError(
        `Invalid experience level. Must be one of: ${this.VALID_LEVELS.join(', ')}`
      );
    }

    return new ExperienceLevel(normalizedLevel);
  }

  public static entryLevel(): ExperienceLevel {
    return new ExperienceLevel(this.ENTRY_LEVEL);
  }

  public static junior(): ExperienceLevel {
    return new ExperienceLevel(this.JUNIOR);
  }

  public static midLevel(): ExperienceLevel {
    return new ExperienceLevel(this.MID_LEVEL);
  }

  public static senior(): ExperienceLevel {
    return new ExperienceLevel(this.SENIOR);
  }

  public static lead(): ExperienceLevel {
    return new ExperienceLevel(this.LEAD);
  }

  public static principal(): ExperienceLevel {
    return new ExperienceLevel(this.PRINCIPAL);
  }

  public getName(): string {
    return ExperienceLevel.LEVEL_NAMES[this._value];
  }

  public getHierarchyLevel(): number {
    return ExperienceLevel.LEVEL_HIERARCHY[this._value];
  }

  public isAtLeast(other: ExperienceLevel): boolean {
    return this.getHierarchyLevel() >= other.getHierarchyLevel();
  }

  public isBelow(other: ExperienceLevel): boolean {
    return this.getHierarchyLevel() < other.getHierarchyLevel();
  }

  public toString(): string {
    return this.getName();
  }
}

/**
 * Career Goal value object
 */
export class CareerGoal extends ValueObject<{
  title: string;
  description: string;
  targetLevel: ExperienceLevel;
  timeframemonths: number;
}> {
  private constructor(
    title: string,
    description: string,
    targetLevel: ExperienceLevel,
    timeframeMonths: number
  ) {
    super({
      title: title.trim(),
      description: description.trim(),
      targetLevel,
      timeframemonths: timeframeMonths
    });
  }

  public static create(
    title: string,
    description: string,
    targetLevel: ExperienceLevel,
    timeframeMonths: number
  ): CareerGoal {
    if (!title || title.trim().length < 3) {
      throw new InvalidCareerGoalError('Career goal title must be at least 3 characters');
    }

    if (!description || description.trim().length < 10) {
      throw new InvalidCareerGoalError('Career goal description must be at least 10 characters');
    }

    if (timeframeMonths <= 0 || timeframeMonths > 120) {
      throw new InvalidCareerGoalError('Timeframe must be between 1 and 120 months');
    }

    return new CareerGoal(title, description, targetLevel, timeframeMonths);
  }

  get title(): string {
    return this._value.title;
  }

  get description(): string {
    return this._value.description;
  }

  get targetLevel(): ExperienceLevel {
    return this._value.targetLevel;
  }

  get timeframeMonths(): number {
    return this._value.timeframemonths;
  }

  get timeframeYears(): number {
    return Math.round((this._value.timeframemonths / 12) * 10) / 10;
  }

  public isShortTerm(): boolean {
    return this._value.timeframemonths <= 12;
  }

  public isMediumTerm(): boolean {
    return this._value.timeframemonths > 12 && this._value.timeframemonths <= 36;
  }

  public isLongTerm(): boolean {
    return this._value.timeframemonths > 36;
  }
}

// Domain Errors
export class InvalidSkillIdError extends DomainError {
  constructor(message: string) {
    super(message, 'INVALID_SKILL_ID');
  }
}

export class InvalidSkillNameError extends DomainError {
  constructor(message: string) {
    super(message, 'INVALID_SKILL_NAME');
  }
}

export class InvalidSkillLevelError extends DomainError {
  constructor(message: string) {
    super(message, 'INVALID_SKILL_LEVEL');
  }
}

export class InvalidExperienceLevelError extends DomainError {
  constructor(message: string) {
    super(message, 'INVALID_EXPERIENCE_LEVEL');
  }
}

export class InvalidCareerGoalError extends DomainError {
  constructor(message: string) {
    super(message, 'INVALID_CAREER_GOAL');
  }
}
