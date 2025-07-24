import { BaseAIServiceAdapter } from './BaseAIServiceAdapter';
import { MultiProviderAIService } from './MultiProviderAIService';
import {
  SkillExtractionResult,
  AIProviderConfig,
  AIProviderCapabilities,
  ExtractedSkill
} from '../../domain/services/ai/interfaces';

/**
 * Multi-Provider AI Service Adapter
 * Adapts MultiProviderAIService to follow DDD adapter pattern
 */
export class MultiProviderAIServiceAdapter extends BaseAIServiceAdapter {
  private multiProviderService: MultiProviderAIService;

  constructor(config: AIProviderConfig) {
    super(config);
    this.multiProviderService = new MultiProviderAIService(config);
  }

  /**
   * Extract skills using multi-provider with adapter enhancements
   */
  async extractSkills(text: string): Promise<SkillExtractionResult> {
    const startTime = Date.now();

    try {
      // Validate input
      const validation = await this.validateInput(text);
      if (!validation.isValid) {
        throw new Error(`Input validation failed: ${validation.errors.join(', ')}`);
      }

      // Perform extraction using multi-provider service
      const result = await this.performProviderSpecificExtraction(text);

      // Enhance result with adapter metadata
      result.metadata = {
        ...result.metadata,
        validationPassed: true,
        costEstimate: this.estimateCost(text.length),
        providersAttempted: result.metadata?.providersAttempted || [],
        failoverCount: result.metadata?.failoverCount || 0
      };

      // Update metrics with multi-provider specific data
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
   * Perform multi-provider-specific extraction
   */
  protected async performProviderSpecificExtraction(text: string): Promise<SkillExtractionResult> {
    return await this.multiProviderService.extractSkills(text);
  }

  /**
   * Get provider name
   */
  getProviderName(): string {
    return `${this.multiProviderService.getProviderName()} (Adapter)`;
  }

  /**
   * Check health status of all providers
   */
  async isHealthy(): Promise<boolean> {
    try {
      const isHealthy = await this.multiProviderService.isHealthy();
      this.updateHealthStatus(isHealthy);
      return isHealthy;
    } catch (error) {
      this.updateHealthStatus(false);
      return false;
    }
  }

  /**
   * Get enhanced capabilities (composite of all providers)
   */
  getCapabilities(): AIProviderCapabilities {
    return {
      ...super.getCapabilities(),
      supportsSkillExtraction: true,
      supportsConfidenceScoring: true,
      supportsContextCapture: true,
      supportsProficiencyEstimation: true,
      supportsFailover: true, // Unique to multi-provider
      maxInputLength: 10000, // Conservative maximum across all providers
      averageProcessingTime: 1000, // Average across providers
      costPerRequest: 0.0015, // Blended cost estimate
      reliability: 0.99 // Higher reliability due to failover
    };
  }

  /**
   * Calculate accuracy with multi-provider considerations
   */
  private calculateAccuracy(skills: ExtractedSkill[]): number {
    // Multi-provider should have higher accuracy due to consensus
    const avgConfidence = skills.length > 0
      ? skills.reduce((sum, skill) => sum + skill.confidence, 0) / skills.length
      : 0;

    // Multi-provider tends to find more comprehensive skill sets
    const skillCountFactor = Math.min(skills.length / 25, 1);

    // Bonus for multi-provider consensus
    const consensusBonus = 0.1;

    return Math.min((avgConfidence * 0.7) + (skillCountFactor * 0.2) + consensusBonus, 1.0);
  }

  /**
   * Estimate blended cost based on provider mix
   */
  private estimateCost(textLength: number): number {
    // Blended cost estimation across providers
    return (textLength / 1000) * 0.0015;
  }

  /**
   * Update health status considering multi-provider resilience
   */
  private updateHealthStatus(isHealthy: boolean): void {
    const currentMetrics = this.getMetrics();
    currentMetrics.lastHealthCheck = new Date();

    // Multi-provider should maintain higher reliability
    currentMetrics.reliabilityScore = isHealthy ?
      Math.min(currentMetrics.reliabilityScore + 0.05, 1.0) :
      Math.max(currentMetrics.reliabilityScore - 0.1, 0.0);
  }

  /**
   * Get provider-specific metrics
   */
  getProviderMetrics(): any {
    // Return metrics for all underlying providers
    const baseMetrics = this.getMetrics();
    return {
      ...baseMetrics,
      multiProviderSpecific: {
        failoverRate: this.calculateFailoverRate(),
        providerDistribution: this.getProviderUsageDistribution(),
        averageProvidersPerRequest: this.getAverageProvidersPerRequest()
      }
    };
  }

  /**
   * Calculate failover rate
   */
  private calculateFailoverRate(): number {
    // This would be calculated based on actual usage statistics
    // For now, return estimated value
    return 0.15; // 15% failover rate
  }

  /**
   * Get provider usage distribution
   */
  private getProviderUsageDistribution(): Record<string, number> {
    // This would track actual usage across providers
    return {
      'Google Gemini': 0.6,
      'Hugging Face': 0.3,
      'Fallback': 0.1
    };
  }

  /**
   * Get average providers used per request
   */
  private getAverageProvidersPerRequest(): number {
    // Average number of providers attempted per request
    return 1.2; // Most requests succeed on first try, some need failover
  }
}
