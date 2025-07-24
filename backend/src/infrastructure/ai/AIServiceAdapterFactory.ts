import {
  IAIAnalysisService,
  AIProviderConfig,
  ProviderType
} from '../../domain/services/ai/interfaces';
import { GeminiAIServiceAdapter } from './GeminiAIServiceAdapter';
import { HuggingFaceAIServiceAdapter } from './HuggingFaceAIServiceAdapter';
import { MultiProviderAIServiceAdapter } from './MultiProviderAIServiceAdapter';

/**
 * AI Service Adapter Factory
 * Implements Factory Pattern for creating AI service adapters
 * Part of AI-006: Service Registration and Factory Pattern
 */
export class AIServiceAdapterFactory {
  private static instance: AIServiceAdapterFactory;
  private registeredAdapters = new Map<string, new (config: AIProviderConfig) => IAIAnalysisService>();
  private configuredAdapters = new Map<string, IAIAnalysisService>();

  private constructor() {
    // Register default adapters
    this.registerAdapter('gemini', GeminiAIServiceAdapter);
    this.registerAdapter('huggingface', HuggingFaceAIServiceAdapter);
    this.registerAdapter('multi-provider', MultiProviderAIServiceAdapter);
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): AIServiceAdapterFactory {
    if (!AIServiceAdapterFactory.instance) {
      AIServiceAdapterFactory.instance = new AIServiceAdapterFactory();
    }
    return AIServiceAdapterFactory.instance;
  }

  /**
   * Register a new adapter type
   */
  registerAdapter(
    name: string,
    adapterClass: new (config: AIProviderConfig) => IAIAnalysisService
  ): void {
    this.registeredAdapters.set(name.toLowerCase(), adapterClass);
  }

  /**
   * Create and configure an adapter
   */
  createAdapter(providerType: ProviderType | string, config: AIProviderConfig): IAIAnalysisService {
    const normalizedName = providerType.toLowerCase();

    // Check if already configured
    const cacheKey = `${normalizedName}_${this.generateConfigHash(config)}`;
    if (this.configuredAdapters.has(cacheKey)) {
      return this.configuredAdapters.get(cacheKey)!;
    }

    // Get adapter class
    const AdapterClass = this.registeredAdapters.get(normalizedName);
    if (!AdapterClass) {
      throw new Error(`No adapter registered for provider: ${providerType}`);
    }

    // Create and cache adapter
    const adapter = new AdapterClass(config);
    this.configuredAdapters.set(cacheKey, adapter);

    return adapter;
  }

  /**
   * Create multi-provider adapter with all available providers
   */
  createMultiProviderAdapter(configs: Record<string, AIProviderConfig>): IAIAnalysisService {
    // Combine all configs into a multi-provider config
    const multiConfig: AIProviderConfig = {
      ...configs['multi-provider'] || {},
      apiKey: '', // Multi-provider manages individual keys
      model: 'multi-provider',
      providers: configs
    };

    return this.createAdapter('multi-provider', multiConfig);
  }

  /**
   * Get default adapter based on environment
   */
  getDefaultAdapter(configs: Record<string, AIProviderConfig>): IAIAnalysisService {
    // Prioritize multi-provider for production environments
    if (process.env.NODE_ENV === 'production') {
      return this.createMultiProviderAdapter(configs);
    }

    // For development, use the first available provider
    const availableProviders = Object.keys(configs);
    if (availableProviders.includes('gemini')) {
      return this.createAdapter('gemini', configs['gemini']);
    }

    if (availableProviders.includes('huggingface')) {
      return this.createAdapter('huggingface', configs['huggingface']);
    }

    // Fallback to multi-provider
    return this.createMultiProviderAdapter(configs);
  }

  /**
   * List all registered adapter types
   */
  getRegisteredAdapters(): string[] {
    return Array.from(this.registeredAdapters.keys());
  }

  /**
   * Check if an adapter is registered
   */
  isAdapterRegistered(providerType: string): boolean {
    return this.registeredAdapters.has(providerType.toLowerCase());
  }

  /**
   * Clear all cached adapters (useful for testing)
   */
  clearCache(): void {
    this.configuredAdapters.clear();
  }

  /**
   * Get adapter health status
   */
  async getAdapterHealthStatus(providerType: string, config: AIProviderConfig): Promise<{
    provider: string;
    healthy: boolean;
    capabilities: any;
    error?: string;
  }> {
    try {
      const adapter = this.createAdapter(providerType, config);
      const healthy = await adapter.isHealthy();
      const capabilities = adapter.getCapabilities();

      return {
        provider: adapter.getProviderName(),
        healthy,
        capabilities
      };
    } catch (error) {
      return {
        provider: providerType,
        healthy: false,
        capabilities: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get comprehensive health report for all adapters
   */
  async getComprehensiveHealthReport(configs: Record<string, AIProviderConfig>): Promise<{
    overall: 'healthy' | 'degraded' | 'unhealthy';
    providers: Array<{
      provider: string;
      healthy: boolean;
      capabilities: any;
      error?: string;
    }>;
    recommendations: string[];
  }> {
    const providers = [];
    const recommendations = [];

    // Check each provider
    for (const [providerType, config] of Object.entries(configs)) {
      const status = await this.getAdapterHealthStatus(providerType, config);
      providers.push(status);

      if (!status.healthy) {
        recommendations.push(`${providerType} provider is unhealthy: ${status.error}`);
      }
    }

    // Determine overall health
    const healthyCount = providers.filter(p => p.healthy).length;
    const totalCount = providers.length;

    let overall: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyCount === totalCount) {
      overall = 'healthy';
    } else if (healthyCount > 0) {
      overall = 'degraded';
      recommendations.push('Some providers are unhealthy. Consider using multi-provider setup for resilience.');
    } else {
      overall = 'unhealthy';
      recommendations.push('All providers are unhealthy. Check API keys and network connectivity.');
    }

    return {
      overall,
      providers,
      recommendations
    };
  }

  /**
   * Generate a simple hash of the config for caching
   */
  private generateConfigHash(config: AIProviderConfig): string {
    return Buffer.from(JSON.stringify({
      model: config.model,
      apiKey: config.apiKey?.substring(0, 8) // Only use first 8 chars for security
    })).toString('base64').substring(0, 16);
  }
}

/**
 * Convenience function to get the factory instance
 */
export const getAIServiceFactory = (): AIServiceAdapterFactory => {
  return AIServiceAdapterFactory.getInstance();
};

/**
 * Service Registration Helper
 * Makes it easy to register custom adapters
 */
export class AdapterRegistry {
  static register(
    name: string,
    adapterClass: new (config: AIProviderConfig) => IAIAnalysisService
  ): void {
    const factory = getAIServiceFactory();
    factory.registerAdapter(name, adapterClass);
  }

  static createAdapter(providerType: string, config: AIProviderConfig): IAIAnalysisService {
    const factory = getAIServiceFactory();
    return factory.createAdapter(providerType, config);
  }

  static getDefaultAdapter(configs: Record<string, AIProviderConfig>): IAIAnalysisService {
    const factory = getAIServiceFactory();
    return factory.getDefaultAdapter(configs);
  }
}
