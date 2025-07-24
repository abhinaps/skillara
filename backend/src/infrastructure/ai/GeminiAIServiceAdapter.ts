import { BaseAIServiceAdapter } from './BaseAIServiceAdapter';
import { GeminiAIService } from './GeminiAIService';
import {
  SkillExtractionResult,
  AIProviderConfig,
  AIProviderCapabilities
} from '../../domain/services/ai/interfaces';

/**
 * Gemini AI Service Adapter
 * Adapts GeminiAIService to follow DDD adapter pattern
 */
export class GeminiAIServiceAdapter extends BaseAIServiceAdapter {
  private geminiService: GeminiAIService;

  constructor(config: AIProviderConfig) {
    super(config);
    this.geminiService = new GeminiAIService(config);
  }

  /**
   * Extract skills using Gemini with adapter enhancements
   */
  async extractSkills(text: string): Promise<SkillExtractionResult> {
    const startTime = Date.now();

    try {
      // Validate input
      const validation = await this.validateInput(text);
      if (!validation.isValid) {
        throw new Error(`Input validation failed: ${validation.errors.join(', ')}`);
      }

      // Perform extraction using Gemini service
      const result = await this.performProviderSpecificExtraction(text);

      // Enhance result with adapter metadata
      result.metadata = {
        ...result.metadata,
        validationPassed: true,
        costEstimate: this.estimateCost(text.length)
      };

      // Update metrics
      const accuracy = this.calculateAccuracy(result.skills);
      this.updateMetrics(result.processingTime, true, accuracy);

      return result;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      this.updateMetrics(processingTime, false);
      throw error;
    }
  }

  /**
   * Perform Gemini-specific extraction
   */
  protected async performProviderSpecificExtraction(text: string): Promise<SkillExtractionResult> {
    return await this.geminiService.extractSkills(text);
  }

  /**
   * Get provider name
   */
  getProviderName(): string {
    return `${this.geminiService.getProviderName()} (Adapter)`;
  }

  /**
   * Check health status
   */
  async isHealthy(): Promise<boolean> {
    try {
      const isHealthy = await this.geminiService.isHealthy();
      this.updateHealthStatus(isHealthy);
      return isHealthy;
    } catch (error) {
      this.updateHealthStatus(false);
      return false;
    }
  }

  /**
   * Get enhanced capabilities
   */
  getCapabilities(): AIProviderCapabilities {
    return {
      ...super.getCapabilities(),
      supportsSkillExtraction: true,
      supportsConfidenceScoring: true,
      supportsContextCapture: true,
      supportsProficiencyEstimation: true,
      maxInputLength: 8000, // Gemini specific limit
      averageProcessingTime: 800,
      costPerRequest: 0.002 // Estimated cost per request
    };
  }

  /**
   * Calculate accuracy based on expected skills
   */
  private calculateAccuracy(skills: ExtractedSkill[]): number {
    // Simple accuracy estimation based on confidence scores and skill count
    const avgConfidence = skills.length > 0
      ? skills.reduce((sum, skill) => sum + skill.confidence, 0) / skills.length
      : 0;

    // Factor in number of skills found (reasonable expectation: 10-30 skills)
    const skillCountFactor = Math.min(skills.length / 20, 1);

    return (avgConfidence * 0.7) + (skillCountFactor * 0.3);
  }

  /**
   * Estimate cost based on input length
   */
  private estimateCost(textLength: number): number {
    // Rough estimation: $0.002 per 1000 characters
    return (textLength / 1000) * 0.002;
  }

  /**
   * Update health status in metrics
   */
  private updateHealthStatus(isHealthy: boolean): void {
    const currentMetrics = this.getMetrics();
    currentMetrics.lastHealthCheck = new Date();
    currentMetrics.reliabilityScore = isHealthy ?
      Math.min(currentMetrics.reliabilityScore + 0.1, 1.0) :
      Math.max(currentMetrics.reliabilityScore - 0.2, 0.0);
  }
}

import { ExtractedSkill } from '../../domain/services/ai/interfaces';
