import { BaseAIServiceAdapter } from './BaseAIServiceAdapter';
import { HuggingFaceAIService } from './HuggingFaceAIService';
import {
  SkillExtractionResult,
  AIProviderConfig,
  AIProviderCapabilities,
  ExtractedSkill
} from '../../domain/services/ai/interfaces';

/**
 * Hugging Face AI Service Adapter
 * Adapts HuggingFaceAIService to follow DDD adapter pattern
 */
export class HuggingFaceAIServiceAdapter extends BaseAIServiceAdapter {
  private huggingFaceService: HuggingFaceAIService;

  constructor(config: AIProviderConfig) {
    super(config);
    this.huggingFaceService = new HuggingFaceAIService(config);
  }

  /**
   * Extract skills using Hugging Face with adapter enhancements
   */
  async extractSkills(text: string): Promise<SkillExtractionResult> {
    const startTime = Date.now();

    try {
      // Validate input
      const validation = await this.validateInput(text);
      if (!validation.isValid) {
        throw new Error(`Input validation failed: ${validation.errors.join(', ')}`);
      }

      // Perform extraction using Hugging Face service
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
   * Perform Hugging Face-specific extraction
   */
  protected async performProviderSpecificExtraction(text: string): Promise<SkillExtractionResult> {
    return await this.huggingFaceService.extractSkills(text);
  }

  /**
   * Get provider name
   */
  getProviderName(): string {
    return `${this.huggingFaceService.getProviderName()} (Adapter)`;
  }

  /**
   * Check health status
   */
  async isHealthy(): Promise<boolean> {
    try {
      const isHealthy = await this.huggingFaceService.isHealthy();
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
      supportsProficiencyEstimation: false, // HF might have limitations here
      maxInputLength: 10000, // HF specific limit
      averageProcessingTime: 1200,
      costPerRequest: 0.001 // Estimated cost per request (lower than Gemini)
    };
  }

  /**
   * Calculate accuracy based on expected skills for HF models
   */
  private calculateAccuracy(skills: ExtractedSkill[]): number {
    // Hugging Face models might have different accuracy patterns
    const avgConfidence = skills.length > 0
      ? skills.reduce((sum, skill) => sum + skill.confidence, 0) / skills.length
      : 0;

    // HF models tend to be more conservative with skill extraction
    const skillCountFactor = Math.min(skills.length / 15, 1);

    return (avgConfidence * 0.8) + (skillCountFactor * 0.2);
  }

  /**
   * Estimate cost based on input length (HF is typically cheaper)
   */
  private estimateCost(textLength: number): number {
    // Rough estimation: $0.001 per 1000 characters
    return (textLength / 1000) * 0.001;
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
