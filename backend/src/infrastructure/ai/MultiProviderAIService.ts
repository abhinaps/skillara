import { IAIAnalysisService, SkillExtractionResult, AIProviderConfig } from '../../domain/services/ai/interfaces';
import { GeminiAIService } from './GeminiAIService';
import { HuggingFaceAIService } from './HuggingFaceAIService';

/**
 * Multi-Provider AI Service
 * Intelligently routes requests between multiple AI providers for maximum reliability
 */
export class MultiProviderAIService implements IAIAnalysisService {
  private providers: Map<string, IAIAnalysisService> = new Map();
  private healthStatus: Map<string, boolean> = new Map();
  private lastHealthCheck: Date = new Date(0);
  private readonly HEALTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

  constructor(
    private geminiConfig?: AIProviderConfig,
    private huggingfaceConfig?: AIProviderConfig
  ) {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Initialize Gemini if config provided
    if (this.geminiConfig?.apiKey) {
      const geminiService = new GeminiAIService(this.geminiConfig);
      this.providers.set('gemini', geminiService);
      console.log('✅ Gemini AI provider initialized');
    }

    // Initialize HuggingFace if config provided
    if (this.huggingfaceConfig?.apiKey) {
      const hfService = new HuggingFaceAIService(this.huggingfaceConfig);
      this.providers.set('huggingface', hfService);
      console.log('✅ HuggingFace AI provider initialized');
    }

    if (this.providers.size === 0) {
      console.warn('⚠️ No AI providers configured - only fallback pattern matching will be available');
    }
  }

  /**
   * Extract skills using the best available provider
   */
  async extractSkills(text: string): Promise<SkillExtractionResult> {
    console.log('🤖 MultiProviderAIService: Starting skill extraction...');

    // Update health status if needed
    await this.updateHealthStatusIfNeeded();

    // Get provider selection order based on health and preference
    const providerOrder = this.getProviderSelectionOrder();

    let lastError: Error | null = null;

    // Try each provider in order
    for (const providerName of providerOrder) {
      const provider = this.providers.get(providerName);
      if (!provider) continue;

      try {
        console.log(`🔄 Attempting extraction with ${providerName}...`);
        const result = await provider.extractSkills(text);

        // Enhance result with multi-provider metadata
        result.metadata = {
          ...result.metadata,
          multiProviderUsed: true,
          attemptedProviders: providerOrder,
          successfulProvider: providerName
        };

        console.log(`✅ Successful extraction with ${providerName}: ${result.skills.length} skills found`);
        return result;

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.warn(`⚠️ ${providerName} failed: ${errorMessage}`);
        lastError = error instanceof Error ? error : new Error(String(error));

        // Mark provider as unhealthy
        this.healthStatus.set(providerName, false);
        continue;
      }
    }

    // If all providers failed, try fallback with any provider
    console.log('🔄 All primary providers failed, attempting fallback...');
    return this.attemptFallbackExtraction(text, lastError);
  }

  /**
   * Attempt fallback extraction when all providers fail
   */
  private async attemptFallbackExtraction(text: string, lastError: Error | null): Promise<SkillExtractionResult> {
    // Try to use any provider's fallback mechanism
    for (const [providerName, provider] of this.providers.entries()) {
      try {
        console.log(`🔄 Attempting fallback with ${providerName}...`);
        const result = await provider.extractSkills(text);

        result.metadata = {
          ...result.metadata,
          multiProviderUsed: true,
          fallbackMode: true,
          allProvidersDown: true
        };

        console.log(`✅ Fallback successful with ${providerName}: ${result.skills.length} skills found`);
        return result;

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.warn(`⚠️ ${providerName} fallback also failed: ${errorMessage}`);
        continue;
      }
    }

    // If even fallback fails, throw the last error
    throw new Error(`All AI providers and fallback mechanisms failed. Last error: ${lastError?.message || 'Unknown error'}`);
  }

  /**
   * Get provider selection order based on health and preference
   */
  private getProviderSelectionOrder(): string[] {
    const healthyProviders: string[] = [];
    const unhealthyProviders: string[] = [];

    // Separate healthy and unhealthy providers
    for (const [providerName] of this.providers.entries()) {
      const isHealthy = this.healthStatus.get(providerName) !== false; // default to healthy if unknown

      if (isHealthy) {
        healthyProviders.push(providerName);
      } else {
        unhealthyProviders.push(providerName);
      }
    }

    // Define preference order (can be configured)
    const preferenceOrder = ['gemini', 'huggingface'];

    // Sort healthy providers by preference
    const sortedHealthy = healthyProviders.sort((a, b) => {
      const aIndex = preferenceOrder.indexOf(a);
      const bIndex = preferenceOrder.indexOf(b);
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });

    // Sort unhealthy providers by preference (as backup)
    const sortedUnhealthy = unhealthyProviders.sort((a, b) => {
      const aIndex = preferenceOrder.indexOf(a);
      const bIndex = preferenceOrder.indexOf(b);
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });

    return [...sortedHealthy, ...sortedUnhealthy];
  }

  /**
   * Update health status for all providers if needed
   */
  private async updateHealthStatusIfNeeded(): Promise<void> {
    const now = new Date();
    const timeSinceLastCheck = now.getTime() - this.lastHealthCheck.getTime();

    if (timeSinceLastCheck < this.HEALTH_CHECK_INTERVAL) {
      return; // Health check not needed yet
    }

    console.log('🏥 Performing health check on all providers...');
    this.lastHealthCheck = now;

    const healthPromises = Array.from(this.providers.entries()).map(async ([providerName, provider]) => {
      try {
        const isHealthy = await provider.isHealthy();
        this.healthStatus.set(providerName, isHealthy);
        console.log(`   ${providerName}: ${isHealthy ? '✅ Healthy' : '⚠️ Unhealthy'}`);
      } catch (error) {
        this.healthStatus.set(providerName, false);
        console.log(`   ${providerName}: ❌ Health check failed`);
      }
    });

    await Promise.all(healthPromises);
  }

  /**
   * Get provider name (returns multi-provider info)
   */
  getProviderName(): string {
    const providerNames = Array.from(this.providers.keys());
    return `MultiProvider(${providerNames.join(', ')})`;
  }

  /**
   * Check if any provider is healthy
   */
  async isHealthy(): Promise<boolean> {
    await this.updateHealthStatusIfNeeded();

    // Check if any provider is healthy
    for (const [providerName, provider] of this.providers.entries()) {
      try {
        const isHealthy = await provider.isHealthy();
        if (isHealthy) {
          return true;
        }
      } catch (error) {
        continue;
      }
    }

    // If no provider is healthy, we can still work with fallbacks
    return this.providers.size > 0;
  }

  /**
   * Get status of all providers
   */
  async getProviderStatus(): Promise<Record<string, { healthy: boolean; name: string }>> {
    await this.updateHealthStatusIfNeeded();

    const status: Record<string, { healthy: boolean; name: string }> = {};

    for (const [providerName, provider] of this.providers.entries()) {
      const isHealthy = this.healthStatus.get(providerName) ?? false;
      status[providerName] = {
        healthy: isHealthy,
        name: provider.getProviderName()
      };
    }

    return status;
  }

  /**
   * Add a new provider dynamically
   */
  addProvider(name: string, provider: IAIAnalysisService): void {
    this.providers.set(name, provider);
    this.healthStatus.delete(name); // Reset health status
    console.log(`✅ Added new provider: ${name}`);
  }

  /**
   * Remove a provider
   */
  removeProvider(name: string): boolean {
    const removed = this.providers.delete(name);
    this.healthStatus.delete(name);

    if (removed) {
      console.log(`❌ Removed provider: ${name}`);
    }

    return removed;
  }

  /**
   * Get available providers count
   */
  getProviderCount(): number {
    return this.providers.size;
  }

  /**
   * Get provider capabilities (composite of all providers)
   */
  getCapabilities(): import('../../domain/services/ai/interfaces').AIProviderCapabilities {
    return {
      supportsSkillExtraction: true,
      supportsConfidenceScoring: true,
      supportsContextCapture: true,
      supportsProficiencyEstimation: true,
      supportsFailover: true,
      maxInputLength: 10000, // Conservative maximum
      averageProcessingTime: 1000, // Average across providers
      costPerRequest: 0.0015, // Blended cost
      reliability: 0.99 // Higher reliability due to failover
    };
  }

  /**
   * Validate input text
   */
  async validateInput(text: string): Promise<import('../../domain/services/ai/interfaces').ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!text || text.trim().length === 0) {
      errors.push('Input text cannot be empty');
    }

    if (text.length > 10000) {
      errors.push('Input text exceeds maximum length of 10000 characters');
    }

    if (text.length < 50) {
      warnings.push('Input text is very short, results may be limited');
    }

    if (this.providers.size === 0) {
      errors.push('No AI providers are available');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      estimatedProcessingTime: Math.min(text.length * 0.1, 2500)
    };
  }
}
