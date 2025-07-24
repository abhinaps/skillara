import { Skill, UserSkillAssessment, CareerPath } from '../entities';
import { SkillId, SkillName, SkillLevel, ExperienceLevel } from '../value-objects';
import { UniqueId } from '../../shared/value-objects';

/**
 * Repository interface for Skill aggregate
 */
export interface SkillRepository {
  /**
   * Save a skill to the repository
   */
  save(skill: Skill): Promise<void>;

  /**
   * Find a skill by its unique identifier
   */
  findById(id: SkillId): Promise<Skill | null>;

  /**
   * Find a skill by its name
   */
  findByName(name: SkillName): Promise<Skill | null>;

  /**
   * Find skills by category
   */
  findByCategory(category: string): Promise<Skill[]>;

  /**
   * Find all active skills
   */
  findAllActive(): Promise<Skill[]>;

  /**
   * Search skills by name pattern
   */
  searchByName(pattern: string): Promise<Skill[]>;

  /**
   * Check if a skill exists by name
   */
  existsByName(name: SkillName): Promise<boolean>;

  /**
   * Get all skill categories
   */
  getAllCategories(): Promise<string[]>;

  /**
   * Remove a skill from the repository
   */
  delete(id: SkillId): Promise<void>;
}

/**
 * Repository interface for User Skill Assessment aggregate
 */
export interface UserSkillAssessmentRepository {
  /**
   * Save a user skill assessment
   */
  save(assessment: UserSkillAssessment): Promise<void>;

  /**
   * Find assessment by ID
   */
  findById(id: UniqueId): Promise<UserSkillAssessment | null>;

  /**
   * Find all assessments for a user
   */
  findByUserId(userId: UniqueId): Promise<UserSkillAssessment[]>;

  /**
   * Find assessment for a specific user and skill
   */
  findByUserIdAndSkillId(userId: UniqueId, skillId: SkillId): Promise<UserSkillAssessment | null>;

  /**
   * Find all verified assessments for a user
   */
  findVerifiedByUserId(userId: UniqueId): Promise<UserSkillAssessment[]>;

  /**
   * Find all self-assessed (unverified) assessments for a user
   */
  findSelfAssessedByUserId(userId: UniqueId): Promise<UserSkillAssessment[]>;

  /**
   * Find expired assessments
   */
  findExpired(): Promise<UserSkillAssessment[]>;

  /**
   * Get user's skill levels as a map
   */
  getUserSkillLevels(userId: UniqueId): Promise<Map<SkillId, SkillLevel>>;

  /**
   * Remove an assessment
   */
  delete(id: UniqueId): Promise<void>;
}

/**
 * Repository interface for Career Path aggregate
 */
export interface CareerPathRepository {
  /**
   * Save a career path
   */
  save(careerPath: CareerPath): Promise<void>;

  /**
   * Find career path by ID
   */
  findById(id: UniqueId): Promise<CareerPath | null>;

  /**
   * Find career paths by industry
   */
  findByIndustry(industry: string): Promise<CareerPath[]>;

  /**
   * Find career paths by experience level
   */
  findByExperienceLevel(level: ExperienceLevel): Promise<CareerPath[]>;

  /**
   * Find all active career paths
   */
  findAllActive(): Promise<CareerPath[]>;

  /**
   * Search career paths by title
   */
  searchByTitle(pattern: string): Promise<CareerPath[]>;

  /**
   * Find career paths that require a specific skill
   */
  findRequiringSkill(skillId: SkillId): Promise<CareerPath[]>;

  /**
   * Find career paths matching user's skills (above threshold)
   */
  findMatchingUserSkills(userSkills: Map<SkillId, SkillLevel>, threshold: number): Promise<CareerPath[]>;

  /**
   * Get all industries
   */
  getAllIndustries(): Promise<string[]>;

  /**
   * Remove a career path
   */
  delete(id: UniqueId): Promise<void>;
}
