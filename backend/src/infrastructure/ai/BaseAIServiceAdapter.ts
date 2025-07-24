import {
  IAIAnalysisService,
  SkillExtractionResult,
  AIProviderConfig,
  AIProviderCapabilities,
  ValidationResult,
  ConfidenceScoring,
  ProviderMetrics
} from '../../domain/services/ai/interfaces';

/**
 * Base AI Service Adapter
 * Implements common adapter functionality following DDD principles
 */
export abstract class BaseAIServiceAdapter implements IAIAnalysisService {
  protected config: AIProviderConfig;
  protected metrics: ProviderMetrics;
  protected confidenceScoring: ConfidenceScoring;

  constructor(config: AIProviderConfig) {
    this.config = config;
    this.metrics = this.initializeMetrics();
    this.confidenceScoring = new DefaultConfidenceScoring();
  }

  // Abstract methods to be implemented by concrete adapters
  abstract extractSkills(text: string): Promise<SkillExtractionResult>;
  abstract getProviderName(): string;
  abstract isHealthy(): Promise<boolean>;
  protected abstract performProviderSpecificExtraction(text: string): Promise<SkillExtractionResult>;

  /**
   * Get provider capabilities
   */
  getCapabilities(): AIProviderCapabilities {
    return {
      supportsSkillExtraction: true,
      supportsConfidenceScoring: true,
      supportsContextCapture: true,
      supportsProficiencyEstimation: true,
      maxInputLength: 10000,
      averageProcessingTime: this.metrics.averageProcessingTime,
      costPerRequest: 0.001 // Default cost estimation
    };
  }

  /**
   * Validate input before processing
   */
  async validateInput(text: string): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check text length
    if (!text || text.trim().length === 0) {
      errors.push('Input text cannot be empty');
    }

    if (text.length > this.getCapabilities().maxInputLength) {
      errors.push(`Input text exceeds maximum length of ${this.getCapabilities().maxInputLength} characters`);
    }

    if (text.length < 50) {
      warnings.push('Input text is very short, results may be limited');
    }

    // Check for potential issues
    const wordCount = text.split(/\s+/).length;
    if (wordCount < 10) {
      warnings.push('Very few words detected, skill extraction may be limited');
    }

    // Estimate processing time
    const estimatedProcessingTime = Math.max(100, text.length * 0.1);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      estimatedProcessingTime
    };
  }

  /**
   * Update provider metrics
   */
  protected updateMetrics(processingTime: number, success: boolean, accuracy?: number): void {
    this.metrics.totalRequestsProcessed++;

    if (success) {
      // Update average processing time
      this.metrics.averageProcessingTime =
        (this.metrics.averageProcessingTime * (this.metrics.totalRequestsProcessed - 1) + processingTime) /
        this.metrics.totalRequestsProcessed;

      if (accuracy !== undefined) {
        // Update accuracy (weighted average)
        this.metrics.accuracy =
          (this.metrics.accuracy * 0.9) + (accuracy * 0.1);
      }
    } else {
      this.metrics.errorRate =
        (this.metrics.errorRate * (this.metrics.totalRequestsProcessed - 1) + 1) /
        this.metrics.totalRequestsProcessed;
    }

    this.metrics.reliabilityScore = Math.max(0, 1 - this.metrics.errorRate);
    this.metrics.lastHealthCheck = new Date();
  }

  /**
   * Get current provider metrics
   */
  getMetrics(): ProviderMetrics {
    return { ...this.metrics };
  }

  /**
   * Initialize metrics
   */
  private initializeMetrics(): ProviderMetrics {
    return {
      accuracy: 0.75, // Default starting accuracy
      averageProcessingTime: 500, // Default 500ms
      reliabilityScore: 1.0,
      costEfficiency: 1.0,
      lastHealthCheck: new Date(),
      totalRequestsProcessed: 0,
      errorRate: 0
    };
  }
}

/**
 * Default Confidence Scoring Implementation
 */
class DefaultConfidenceScoring implements ConfidenceScoring {
  private readonly CONFIDENCE_THRESHOLD = 0.6;

  calculateOverallConfidence(skills: ExtractedSkill[]): number {
    if (skills.length === 0) return 0;

    const totalConfidence = skills.reduce((sum, skill) => sum + skill.confidence, 0);
    return Math.round((totalConfidence / skills.length) * 100) / 100;
  }

  getConfidenceThreshold(): number {
    return this.CONFIDENCE_THRESHOLD;
  }

  assessSkillConfidence(skillName: string, context: string[], textLength: number): number {
    let confidence = 0.5; // Base confidence

    // Context quality assessment
    const contextQuality = this.assessContextQuality(context);
    confidence += contextQuality * 0.3;

    // Skill name clarity
    const nameClarity = this.assessSkillNameClarity(skillName);
    confidence += nameClarity * 0.2;

    // Text length factor
    const lengthFactor = Math.min(textLength / 1000, 1) * 0.1;
    confidence += lengthFactor;

    return Math.min(Math.max(confidence, 0), 1);
  }

  validateConfidenceScore(score: number): boolean {
    return score >= 0 && score <= 1;
  }

  private assessContextQuality(context: string[]): number {
    if (context.length === 0) return 0;

    let quality = 0;
    context.forEach(ctx => {
      // Look for experience indicators
      if (/\d+\s*years?/i.test(ctx)) quality += 0.3;
      if (/(expert|proficient|experienced|skilled)/i.test(ctx)) quality += 0.2;
      if (/(project|developed|built|implemented)/i.test(ctx)) quality += 0.1;
    });

    return Math.min(quality, 1);
  }

  private assessSkillNameClarity(skillName: string): number {
    // Well-known technologies get higher clarity
    const wellKnownSkills = [
      'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 'SQL',
      'Docker', 'Kubernetes', 'AWS', 'Git', 'TypeScript', 'Angular', 'Vue.js'
    ];

    if (wellKnownSkills.includes(skillName)) return 1;
    if (skillName.length > 2 && skillName.length < 20) return 0.8;
    return 0.5;
  }
}

import { ExtractedSkill } from '../../domain/services/ai/interfaces';
