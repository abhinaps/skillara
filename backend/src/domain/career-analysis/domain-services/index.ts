import { Skill, UserSkillAssessment, CareerPath } from '../entities';
import { SkillId, SkillLevel, ExperienceLevel } from '../value-objects';
import { UniqueId, Percentage } from '../../shared/value-objects';
import { Result, DomainError } from '../../shared/base-entities';
import { SkillRepository, UserSkillAssessmentRepository, CareerPathRepository } from '../repositories';

/**
 * Career Analysis Domain Service
 * Provides business logic for analyzing career paths and skill gaps
 */
export class CareerAnalysisService {
  constructor(
    private skillRepository: SkillRepository,
    private assessmentRepository: UserSkillAssessmentRepository,
    private careerPathRepository: CareerPathRepository
  ) {}

  /**
   * Analyze skill gaps for a user against a specific career path
   */
  async analyzeSkillGaps(userId: UniqueId, careerPathId: UniqueId): Promise<Result<SkillGapAnalysis, CareerAnalysisError>> {
    try {
      // Get career path
      const careerPath = await this.careerPathRepository.findById(careerPathId);
      if (!careerPath) {
        return Result.failure(new CareerAnalysisError('Career path not found', 'CAREER_PATH_NOT_FOUND'));
      }

      // Get user's current skill levels
      const userSkillLevels = await this.assessmentRepository.getUserSkillLevels(userId);

      // Calculate skill gaps
      const skillGaps = careerPath.getSkillGaps(userSkillLevels);
      const matchPercentage = careerPath.calculateSkillMatch(userSkillLevels);

      // Get detailed gap information
      const detailedGaps: SkillGapDetail[] = [];
      for (const [skillId, requiredLevel] of skillGaps) {
        const skill = await this.skillRepository.findById(skillId);
        if (skill) {
          const currentLevel = userSkillLevels.get(skillId);
          const gapSize = requiredLevel.value - (currentLevel?.value || 0);

          detailedGaps.push({
            skill,
            requiredLevel,
            currentLevel,
            gapSize,
            priority: this.calculateGapPriority(gapSize, skill.category)
          });
        }
      }

      // Sort gaps by priority
      detailedGaps.sort((a, b) => b.priority - a.priority);

      const analysis: SkillGapAnalysis = {
        userId,
        careerPath,
        matchPercentage,
        skillGaps: detailedGaps,
        totalGapsCount: detailedGaps.length,
        highPriorityGapsCount: detailedGaps.filter(gap => gap.priority >= 4).length,
        analysisDate: new Date()
      };

      return Result.success(analysis);
    } catch (error) {
      return Result.failure(new CareerAnalysisError('Failed to analyze skill gaps', 'ANALYSIS_FAILED'));
    }
  }

  /**
   * Recommend career paths for a user based on their current skills
   */
  async recommendCareerPaths(userId: UniqueId, options: RecommendationOptions = {}): Promise<Result<CareerPathRecommendation[], CareerAnalysisError>> {
    try {
      // Get user's current skill levels
      const userSkillLevels = await this.assessmentRepository.getUserSkillLevels(userId);

      if (userSkillLevels.size === 0) {
        return Result.failure(new CareerAnalysisError('User has no skill assessments', 'NO_SKILLS_ASSESSED'));
      }

      // Get all active career paths (could be filtered by industry if specified)
      const allPaths = options.industry
        ? await this.careerPathRepository.findByIndustry(options.industry)
        : await this.careerPathRepository.findAllActive();

      // Calculate match for each career path
      const recommendations: CareerPathRecommendation[] = [];

      for (const careerPath of allPaths) {
        const matchPercentage = careerPath.calculateSkillMatch(userSkillLevels);
        const skillGaps = careerPath.getSkillGaps(userSkillLevels);

        // Only include paths with minimum match percentage
        const minMatch = options.minimumMatchPercentage || 30;
        if (matchPercentage.value >= minMatch) {
          recommendations.push({
            careerPath,
            matchPercentage,
            gapsCount: skillGaps.size,
            feasibilityScore: this.calculateFeasibilityScore(matchPercentage, skillGaps.size, careerPath.experienceRequired),
            estimatedTimeToQualify: this.estimateTimeToQualify(skillGaps.size, careerPath.experienceRequired)
          });
        }
      }

      // Sort by feasibility score
      recommendations.sort((a, b) => b.feasibilityScore - a.feasibilityScore);

      // Limit results if requested
      const maxResults = options.maxResults || 10;
      const limitedRecommendations = recommendations.slice(0, maxResults);

      return Result.success(limitedRecommendations);
    } catch (error) {
      return Result.failure(new CareerAnalysisError('Failed to recommend career paths', 'RECOMMENDATION_FAILED'));
    }
  }

  /**
   * Compare multiple career paths for a user
   */
  async compareCareerPaths(userId: UniqueId, careerPathIds: UniqueId[]): Promise<Result<CareerPathComparison, CareerAnalysisError>> {
    try {
      if (careerPathIds.length < 2) {
        return Result.failure(new CareerAnalysisError('At least 2 career paths required for comparison', 'INSUFFICIENT_PATHS'));
      }

      const userSkillLevels = await this.assessmentRepository.getUserSkillLevels(userId);
      const comparisons: PathComparisonItem[] = [];

      for (const pathId of careerPathIds) {
        const careerPath = await this.careerPathRepository.findById(pathId);
        if (!careerPath) {
          continue;
        }

        const matchPercentage = careerPath.calculateSkillMatch(userSkillLevels);
        const skillGaps = careerPath.getSkillGaps(userSkillLevels);

        comparisons.push({
          careerPath,
          matchPercentage,
          gapsCount: skillGaps.size,
          feasibilityScore: this.calculateFeasibilityScore(matchPercentage, skillGaps.size, careerPath.experienceRequired),
          estimatedSalary: careerPath.averageSalary,
          requiredExperience: careerPath.experienceRequired
        });
      }

      const comparison: CareerPathComparison = {
        userId,
        comparisons,
        bestMatch: comparisons.reduce((best, current) =>
          current.matchPercentage.value > best.matchPercentage.value ? current : best
        ),
        mostFeasible: comparisons.reduce((best, current) =>
          current.feasibilityScore > best.feasibilityScore ? current : best
        ),
        comparisonDate: new Date()
      };

      return Result.success(comparison);
    } catch (error) {
      return Result.failure(new CareerAnalysisError('Failed to compare career paths', 'COMPARISON_FAILED'));
    }
  }

  /**
   * Calculate priority for a skill gap (1-5 scale)
   */
  private calculateGapPriority(gapSize: number, skillCategory: string): number {
    // Base priority on gap size
    let priority = Math.min(gapSize, 5);

    // Adjust based on skill category importance
    const criticalCategories = ['programming', 'data-analysis', 'project-management'];
    if (criticalCategories.includes(skillCategory.toLowerCase())) {
      priority = Math.min(priority + 1, 5);
    }

    return priority;
  }

  /**
   * Calculate feasibility score for a career path (0-100)
   */
  private calculateFeasibilityScore(matchPercentage: Percentage, gapsCount: number, experienceRequired: ExperienceLevel): number {
    // Start with match percentage
    let score = matchPercentage.value;

    // Reduce score based on number of gaps
    const gapPenalty = Math.min(gapsCount * 5, 30);
    score -= gapPenalty;

    // Adjust based on experience level requirement
    const experienceBonus = this.getExperienceLevelBonus(experienceRequired);
    score += experienceBonus;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Get experience level bonus for feasibility calculation
   */
  private getExperienceLevelBonus(experienceLevel: ExperienceLevel): number {
    const bonuses: Record<string, number> = {
      'entry-level': 10,
      'junior': 5,
      'mid-level': 0,
      'senior': -5,
      'lead': -10,
      'principal': -15
    };

    return bonuses[experienceLevel.value] || 0;
  }

  /**
   * Estimate time to qualify for a career path (in months)
   */
  private estimateTimeToQualify(gapsCount: number, experienceRequired: ExperienceLevel): number {
    // Base time per skill gap (assuming 2-3 months per skill)
    const baseTimePerGap = 2.5;
    const skillTime = gapsCount * baseTimePerGap;

    // Additional time based on experience requirement
    const experienceTimeMap: Record<string, number> = {
      'entry-level': 0,
      'junior': 6,
      'mid-level': 12,
      'senior': 24,
      'lead': 36,
      'principal': 48
    };

    const experienceTime = experienceTimeMap[experienceRequired.value] || 12;

    return Math.ceil(skillTime + (experienceTime * 0.5)); // Assume 50% overlap
  }
}

// Types for service results
export interface SkillGapDetail {
  skill: Skill;
  requiredLevel: SkillLevel;
  currentLevel: SkillLevel | undefined;
  gapSize: number;
  priority: number;
}

export interface SkillGapAnalysis {
  userId: UniqueId;
  careerPath: CareerPath;
  matchPercentage: Percentage;
  skillGaps: SkillGapDetail[];
  totalGapsCount: number;
  highPriorityGapsCount: number;
  analysisDate: Date;
}

export interface CareerPathRecommendation {
  careerPath: CareerPath;
  matchPercentage: Percentage;
  gapsCount: number;
  feasibilityScore: number;
  estimatedTimeToQualify: number;
}

export interface PathComparisonItem {
  careerPath: CareerPath;
  matchPercentage: Percentage;
  gapsCount: number;
  feasibilityScore: number;
  estimatedSalary: number | null;
  requiredExperience: ExperienceLevel;
}

export interface CareerPathComparison {
  userId: UniqueId;
  comparisons: PathComparisonItem[];
  bestMatch: PathComparisonItem;
  mostFeasible: PathComparisonItem;
  comparisonDate: Date;
}

export interface RecommendationOptions {
  industry?: string;
  minimumMatchPercentage?: number;
  maxResults?: number;
  experienceLevel?: ExperienceLevel;
}

export class CareerAnalysisError extends DomainError {
  constructor(message: string, code: string) {
    super(message, code);
  }
}
