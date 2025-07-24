import { SkillRepository, UserSkillAssessmentRepository } from '../../domain/career-analysis/repositories';
import { Skill, UserSkillAssessment } from '../../domain/career-analysis/entities';
import { SkillName, SkillLevel, ExperienceLevel } from '../../domain/career-analysis/value-objects';
import { UniqueId } from '../../domain/shared/value-objects';
import { Result, DomainError } from '../../domain/shared/base-entities';

/**
 * Use case for creating and managing skills
 */
export class CreateSkillUseCase {
  constructor(private skillRepository: SkillRepository) {}

  async execute(data: CreateSkillRequest): Promise<Result<CreateSkillResponse, SkillCreationError>> {
    try {
      // Check if skill already exists
      const skillName = SkillName.create(data.name);
      const existingSkill = await this.skillRepository.findByName(skillName);

      if (existingSkill) {
        return Result.failure(new SkillCreationError('Skill already exists', 'SKILL_ALREADY_EXISTS'));
      }

      // Create new skill
      const skill = Skill.create(skillName, data.category, data.description);

      // Save to repository
      await this.skillRepository.save(skill);

      const response: CreateSkillResponse = {
        id: skill.id.value,
        name: skill.name.value,
        category: skill.category,
        description: skill.description,
        isActive: skill.isActive,
        createdAt: skill.createdAt
      };

      return Result.success(response);
    } catch (error) {
      return Result.failure(new SkillCreationError(`Failed to create skill: ${error}`, 'CREATION_FAILED'));
    }
  }
}

/**
 * Use case for assessing user skills
 */
export class AssessSkillUseCase {
  constructor(
    private assessmentRepository: UserSkillAssessmentRepository,
    private skillRepository: SkillRepository
  ) {}

  async execute(data: AssessSkillRequest): Promise<Result<AssessSkillResponse, SkillAssessmentError>> {
    try {
      // Validate skill exists
      const skillId = data.skillId;
      const skill = await this.skillRepository.findById(skillId);
      if (!skill) {
        return Result.failure(new SkillAssessmentError('Skill not found', 'SKILL_NOT_FOUND'));
      }

      // Create assessment
      const userId = UniqueId.create(data.userId);
      const level = SkillLevel.create(data.level);
      const experience = ExperienceLevel.create(data.experience);

      const assessment = UserSkillAssessment.create(userId, skillId, level, experience);

      // Save assessment
      await this.assessmentRepository.save(assessment);

      const response: AssessSkillResponse = {
        id: assessment.id.value,
        userId: assessment.userId.value,
        skillId: assessment.skillId.value,
        skillName: skill.name.value,
        level: assessment.level.value,
        levelName: assessment.level.getName(),
        experience: assessment.experience.value,
        experienceName: assessment.experience.getName(),
        selfAssessed: assessment.selfAssessed,
        assessedAt: assessment.assessedAt
      };

      return Result.success(response);
    } catch (error) {
      return Result.failure(new SkillAssessmentError(`Failed to assess skill: ${error}`, 'ASSESSMENT_FAILED'));
    }
  }
}

/**
 * Use case for getting user's skill assessments
 */
export class GetUserSkillsUseCase {
  constructor(
    private assessmentRepository: UserSkillAssessmentRepository,
    private skillRepository: SkillRepository
  ) {}

  async execute(userId: string): Promise<Result<GetUserSkillsResponse, UserSkillsError>> {
    try {
      const userIdVO = UniqueId.create(userId);
      const assessments = await this.assessmentRepository.findByUserId(userIdVO);

      const userSkills: UserSkillInfo[] = [];

      for (const assessment of assessments) {
        const skill = await this.skillRepository.findById(assessment.skillId);
        if (skill) {
          userSkills.push({
            assessmentId: assessment.id.value,
            skillId: skill.id.value,
            skillName: skill.name.value,
            skillCategory: skill.category,
            level: assessment.level.value,
            levelName: assessment.level.getName(),
            experience: assessment.experience.value,
            experienceName: assessment.experience.getName(),
            selfAssessed: assessment.selfAssessed,
            isVerified: assessment.isVerified,
            isExpired: assessment.isExpired,
            assessedAt: assessment.assessedAt,
            expiresAt: assessment.expiresAt
          });
        }
      }

      const response: GetUserSkillsResponse = {
        userId,
        totalSkills: userSkills.length,
        verifiedSkills: userSkills.filter(s => s.isVerified).length,
        expiredSkills: userSkills.filter(s => s.isExpired).length,
        skills: userSkills
      };

      return Result.success(response);
    } catch (error) {
      return Result.failure(new UserSkillsError(`Failed to get user skills: ${error}`, 'FETCH_FAILED'));
    }
  }
}

// DTOs and Types
export interface CreateSkillRequest {
  name: string;
  category: string;
  description: string;
}

export interface CreateSkillResponse {
  id: string;
  name: string;
  category: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
}

export interface AssessSkillRequest {
  userId: string;
  skillId: any; // Will be SkillId
  level: number; // 1-5
  experience: string; // entry-level, junior, etc.
}

export interface AssessSkillResponse {
  id: string;
  userId: string;
  skillId: string;
  skillName: string;
  level: number;
  levelName: string;
  experience: string;
  experienceName: string;
  selfAssessed: boolean;
  assessedAt: Date;
}

export interface UserSkillInfo {
  assessmentId: string;
  skillId: string;
  skillName: string;
  skillCategory: string;
  level: number;
  levelName: string;
  experience: string;
  experienceName: string;
  selfAssessed: boolean;
  isVerified: boolean;
  isExpired: boolean;
  assessedAt: Date;
  expiresAt: Date | null;
}

export interface GetUserSkillsResponse {
  userId: string;
  totalSkills: number;
  verifiedSkills: number;
  expiredSkills: number;
  skills: UserSkillInfo[];
}

// Errors
export class SkillCreationError extends DomainError {
  constructor(message: string, code: string) {
    super(message, code);
  }
}

export class SkillAssessmentError extends DomainError {
  constructor(message: string, code: string) {
    super(message, code);
  }
}

export class UserSkillsError extends DomainError {
  constructor(message: string, code: string) {
    super(message, code);
  }
}
