import { BaseDomainEvent } from '../../shared/base-entities';

/**
 * Skill Assessed Event - Fired when a user assesses their skill level
 */
export class SkillAssessedEvent extends BaseDomainEvent {
  public readonly userId: string;
  public readonly skillId: string;
  public readonly level: string;
  public readonly experience: string;

  constructor(
    aggregateId: string,
    userId: string,
    skillId: string,
    level: string,
    experience: string
  ) {
    super(aggregateId, 'SkillAssessed');
    this.userId = userId;
    this.skillId = skillId;
    this.level = level;
    this.experience = experience;
  }
}

/**
 * Career Path Created Event - Fired when a new career path is created
 */
export class CareerPathCreatedEvent extends BaseDomainEvent {
  public readonly title: string;
  public readonly industry: string;
  public readonly experienceRequired: string;

  constructor(
    aggregateId: string,
    title: string,
    industry: string,
    experienceRequired: string
  ) {
    super(aggregateId, 'CareerPathCreated');
    this.title = title;
    this.industry = industry;
    this.experienceRequired = experienceRequired;
  }
}

/**
 * Skill Added to Career Path Event
 */
export class SkillAddedToCareerPathEvent extends BaseDomainEvent {
  public readonly careerPathId: string;
  public readonly skillId: string;
  public readonly level: string;
  public readonly isRequired: boolean;

  constructor(
    aggregateId: string,
    careerPathId: string,
    skillId: string,
    level: string,
    isRequired: boolean
  ) {
    super(aggregateId, 'SkillAddedToCareerPath');
    this.careerPathId = careerPathId;
    this.skillId = skillId;
    this.level = level;
    this.isRequired = isRequired;
  }
}

/**
 * Career Goal Set Event - Fired when a user sets a career goal
 */
export class CareerGoalSetEvent extends BaseDomainEvent {
  public readonly userId: string;
  public readonly title: string;
  public readonly targetLevel: string;
  public readonly timeframeMonths: number;

  constructor(
    aggregateId: string,
    userId: string,
    title: string,
    targetLevel: string,
    timeframeMonths: number
  ) {
    super(aggregateId, 'CareerGoalSet');
    this.userId = userId;
    this.title = title;
    this.targetLevel = targetLevel;
    this.timeframeMonths = timeframeMonths;
  }
}

/**
 * Skill Gap Identified Event - Fired when skill gaps are identified for a user
 */
export class SkillGapIdentifiedEvent extends BaseDomainEvent {
  public readonly userId: string;
  public readonly careerPathId: string;
  public readonly skillId: string;
  public readonly requiredLevel: string;
  public readonly currentLevel: string | null;
  public readonly gapSize: number;

  constructor(
    aggregateId: string,
    userId: string,
    careerPathId: string,
    skillId: string,
    requiredLevel: string,
    currentLevel: string | null,
    gapSize: number
  ) {
    super(aggregateId, 'SkillGapIdentified');
    this.userId = userId;
    this.careerPathId = careerPathId;
    this.skillId = skillId;
    this.requiredLevel = requiredLevel;
    this.currentLevel = currentLevel;
    this.gapSize = gapSize;
  }
}

/**
 * Assessment Verified Event - Fired when a skill assessment is verified by an expert
 */
export class AssessmentVerifiedEvent extends BaseDomainEvent {
  public readonly assessmentId: string;
  public readonly verifiedBy: string;
  public readonly userId: string;
  public readonly skillId: string;

  constructor(
    aggregateId: string,
    assessmentId: string,
    verifiedBy: string,
    userId: string,
    skillId: string
  ) {
    super(aggregateId, 'AssessmentVerified');
    this.assessmentId = assessmentId;
    this.verifiedBy = verifiedBy;
    this.userId = userId;
    this.skillId = skillId;
  }
}

/**
 * Skill Created Event - Fired when a new skill is added to the system
 */
export class SkillCreatedEvent extends BaseDomainEvent {
  public readonly name: string;
  public readonly category: string;
  public readonly description: string;

  constructor(
    aggregateId: string,
    name: string,
    category: string,
    description: string
  ) {
    super(aggregateId, 'SkillCreated');
    this.name = name;
    this.category = category;
    this.description = description;
  }
}

/**
 * Career Analysis Completed Event - Fired when a complete career analysis is done
 */
export class CareerAnalysisCompletedEvent extends BaseDomainEvent {
  public readonly userId: string;
  public readonly analysisType: string;
  public readonly recommendedPaths: string[];
  public readonly skillGapsCount: number;
  public readonly matchPercentage: number;

  constructor(
    aggregateId: string,
    userId: string,
    analysisType: string,
    recommendedPaths: string[],
    skillGapsCount: number,
    matchPercentage: number
  ) {
    super(aggregateId, 'CareerAnalysisCompleted');
    this.userId = userId;
    this.analysisType = analysisType;
    this.recommendedPaths = recommendedPaths;
    this.skillGapsCount = skillGapsCount;
    this.matchPercentage = matchPercentage;
  }
}
