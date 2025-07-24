import { AggregateRoot } from '../../shared/base-entities';
import { UniqueId, Email, Percentage } from '../../shared/value-objects';
import { SkillId, SkillName, SkillLevel, ExperienceLevel } from '../value-objects';
import { SkillAssessedEvent } from '../events';

/**
 * Skill Entity - Represents a specific skill in the system
 */
export class Skill extends AggregateRoot<SkillId> {
  private _name: SkillName;
  private _category: string;
  private _description: string;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: SkillId,
    name: SkillName,
    category: string,
    description: string,
    isActive: boolean = true
  ) {
    super(id);
    this._name = name;
    this._category = category;
    this._description = description;
    this._isActive = isActive;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  public static create(
    name: SkillName,
    category: string,
    description: string
  ): Skill {
    const id = SkillId.generate();
    return new Skill(id, name, category, description);
  }

  public static reconstitute(
    id: SkillId,
    name: SkillName,
    category: string,
    description: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date
  ): Skill {
    const skill = new Skill(id, name, category, description, isActive);
    skill._createdAt = createdAt;
    skill._updatedAt = updatedAt;
    return skill;
  }

  // Getters
  get name(): SkillName {
    return this._name;
  }

  get category(): string {
    return this._category;
  }

  get description(): string {
    return this._description;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business methods
  public updateDescription(description: string): void {
    this._description = description;
    this._updatedAt = new Date();
  }

  public changeCategory(category: string): void {
    this._category = category;
    this._updatedAt = new Date();
  }

  public deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  public activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }
}

/**
 * User Skill Assessment - Represents a user's proficiency in a specific skill
 */
export class UserSkillAssessment extends AggregateRoot<UniqueId> {
  private _userId: UniqueId;
  private _skillId: SkillId;
  private _level: SkillLevel;
  private _experience: ExperienceLevel;
  private _selfAssessed: boolean;
  private _verifiedBy: UniqueId | null;
  private _assessedAt: Date;
  private _expiresAt: Date | null;

  private constructor(
    id: UniqueId,
    userId: UniqueId,
    skillId: SkillId,
    level: SkillLevel,
    experience: ExperienceLevel,
    selfAssessed: boolean = true,
    verifiedBy: UniqueId | null = null,
    expiresAt: Date | null = null
  ) {
    super(id);
    this._userId = userId;
    this._skillId = skillId;
    this._level = level;
    this._experience = experience;
    this._selfAssessed = selfAssessed;
    this._verifiedBy = verifiedBy;
    this._assessedAt = new Date();
    this._expiresAt = expiresAt;
  }

  public static create(
    userId: UniqueId,
    skillId: SkillId,
    level: SkillLevel,
    experience: ExperienceLevel
  ): UserSkillAssessment {
    const id = UniqueId.generate();
    const assessment = new UserSkillAssessment(id, userId, skillId, level, experience);

    // Add domain event
    assessment.markModified(new SkillAssessedEvent(
      id.value,
      userId.value,
      skillId.value,
      level.toString(),
      experience.toString()
    ));

    return assessment;
  }

  public static reconstitute(
    id: UniqueId,
    userId: UniqueId,
    skillId: SkillId,
    level: SkillLevel,
    experience: ExperienceLevel,
    selfAssessed: boolean,
    verifiedBy: UniqueId | null,
    assessedAt: Date,
    expiresAt: Date | null
  ): UserSkillAssessment {
    const assessment = new UserSkillAssessment(
      id, userId, skillId, level, experience, selfAssessed, verifiedBy, expiresAt
    );
    assessment._assessedAt = assessedAt;
    return assessment;
  }

  // Getters
  get userId(): UniqueId {
    return this._userId;
  }

  get skillId(): SkillId {
    return this._skillId;
  }

  get level(): SkillLevel {
    return this._level;
  }

  get experience(): ExperienceLevel {
    return this._experience;
  }

  get selfAssessed(): boolean {
    return this._selfAssessed;
  }

  get verifiedBy(): UniqueId | null {
    return this._verifiedBy;
  }

  get assessedAt(): Date {
    return this._assessedAt;
  }

  get expiresAt(): Date | null {
    return this._expiresAt;
  }

  get isExpired(): boolean {
    return this._expiresAt ? new Date() > this._expiresAt : false;
  }

  get isVerified(): boolean {
    return !this._selfAssessed && this._verifiedBy !== null;
  }

  // Business methods
  public updateLevel(level: SkillLevel): void {
    this._level = level;
    this._assessedAt = new Date();
  }

  public updateExperience(experience: ExperienceLevel): void {
    this._experience = experience;
    this._assessedAt = new Date();
  }

  public verify(verifiedBy: UniqueId): void {
    this._selfAssessed = false;
    this._verifiedBy = verifiedBy;
    this._assessedAt = new Date();
  }

  public setExpiration(expiresAt: Date): void {
    this._expiresAt = expiresAt;
  }

  public refresh(): void {
    this._assessedAt = new Date();
    this._expiresAt = null;
  }
}

/**
 * Career Path - Represents a career progression path
 */
export class CareerPath extends AggregateRoot<UniqueId> {
  private _title: string;
  private _description: string;
  private _industry: string;
  private _requiredSkills: Map<SkillId, SkillLevel>;
  private _preferredSkills: Map<SkillId, SkillLevel>;
  private _averageSalary: number | null;
  private _experienceRequired: ExperienceLevel;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: UniqueId,
    title: string,
    description: string,
    industry: string,
    experienceRequired: ExperienceLevel
  ) {
    super(id);
    this._title = title;
    this._description = description;
    this._industry = industry;
    this._requiredSkills = new Map();
    this._preferredSkills = new Map();
    this._averageSalary = null;
    this._experienceRequired = experienceRequired;
    this._isActive = true;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  public static create(
    title: string,
    description: string,
    industry: string,
    experienceRequired: ExperienceLevel
  ): CareerPath {
    const id = UniqueId.generate();
    return new CareerPath(id, title, description, industry, experienceRequired);
  }

  // Getters
  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get industry(): string {
    return this._industry;
  }

  get requiredSkills(): Map<SkillId, SkillLevel> {
    return new Map(this._requiredSkills);
  }

  get preferredSkills(): Map<SkillId, SkillLevel> {
    return new Map(this._preferredSkills);
  }

  get averageSalary(): number | null {
    return this._averageSalary;
  }

  get experienceRequired(): ExperienceLevel {
    return this._experienceRequired;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business methods
  public addRequiredSkill(skillId: SkillId, level: SkillLevel): void {
    this._requiredSkills.set(skillId, level);
    this._updatedAt = new Date();
  }

  public removeRequiredSkill(skillId: SkillId): void {
    this._requiredSkills.delete(skillId);
    this._updatedAt = new Date();
  }

  public addPreferredSkill(skillId: SkillId, level: SkillLevel): void {
    this._preferredSkills.set(skillId, level);
    this._updatedAt = new Date();
  }

  public removePreferredSkill(skillId: SkillId): void {
    this._preferredSkills.delete(skillId);
    this._updatedAt = new Date();
  }

  public updateSalary(salary: number): void {
    this._averageSalary = salary;
    this._updatedAt = new Date();
  }

  public calculateSkillMatch(userSkills: Map<SkillId, SkillLevel>): Percentage {
    const requiredSkillsCount = this._requiredSkills.size;
    if (requiredSkillsCount === 0) {
      return Percentage.create(100);
    }

    let matchedSkills = 0;
    for (const [skillId, requiredLevel] of this._requiredSkills) {
      const userLevel = userSkills.get(skillId);
      if (userLevel && userLevel.value >= requiredLevel.value) {
        matchedSkills++;
      }
    }

    const matchPercentage = (matchedSkills / requiredSkillsCount) * 100;
    return Percentage.create(matchPercentage);
  }

  public getSkillGaps(userSkills: Map<SkillId, SkillLevel>): Map<SkillId, SkillLevel> {
    const gaps = new Map<SkillId, SkillLevel>();

    for (const [skillId, requiredLevel] of this._requiredSkills) {
      const userLevel = userSkills.get(skillId);
      if (!userLevel || userLevel.value < requiredLevel.value) {
        gaps.set(skillId, requiredLevel);
      }
    }

    return gaps;
  }
}
