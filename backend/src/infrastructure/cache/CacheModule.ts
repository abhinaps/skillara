import { CacheRepository } from './interfaces/CacheRepository';
import { RedisRepository } from './RedisRepository';
import { CacheService } from './CacheService';
import { CacheConfigFactory } from './CacheConfigFactory';

/**
 * Cache Manager - Singleton pattern for cache services
 * Following the existing DIContainer pattern
 */
export class CacheManager {

  /**
   * Register cache services with the DI container
   */
  static async register(container: DIContainer): Promise<void> {
    console.log('🔄 Registering cache services...');

    try {
      // Create cache configuration
      const cacheConfig = CacheConfigFactory.createConfig();
      CacheConfigFactory.validateConfig(cacheConfig);

      // Create cache events handlers
      const cacheEvents = CacheConfigFactory.createCacheEvents();

      // Register Redis Repository
      const redisRepository = new RedisRepository(cacheConfig, cacheEvents);
      container.register('CacheRepository', redisRepository);

      // Register Cache Service
      const cacheService = new CacheService(redisRepository);
      container.register('CacheService', cacheService);

      // Initialize cache connection
      await cacheService.initialize();

      console.log('✅ Cache services registered successfully');
    } catch (error) {
      console.error('❌ Failed to register cache services:', error);
      throw error;
    }
  }

  /**
   * Register cache services for testing environment
   */
  static async registerForTesting(container: Container): Promise<void> {
    console.log('🧪 Registering cache services for testing...');

    try {
      // Use test configuration
      const cacheConfig = CacheConfigFactory.createTestConfig();
      CacheConfigFactory.validateConfig(cacheConfig);

      const cacheEvents = CacheConfigFactory.createCacheEvents();

      // Register test Redis Repository
      const redisRepository = new RedisRepository(cacheConfig, cacheEvents);
      container.register('CacheRepository', redisRepository);

      // Register test Cache Service
      const cacheService = new CacheService(redisRepository);
      container.register('CacheService', cacheService);

      // Initialize with shorter timeout for tests
      await cacheService.initialize();

      console.log('✅ Test cache services registered successfully');
    } catch (error) {
      console.warn('⚠️ Cache not available for testing, continuing without cache:', error.message);

      // Register mock cache service for testing
      container.register('CacheRepository', new MockCacheRepository());
      container.register('CacheService', new MockCacheService());
    }
  }

  /**
   * Gracefully shutdown cache services
   */
  static async shutdown(container: Container): Promise<void> {
    console.log('🔄 Shutting down cache services...');

    try {
      const cacheService = container.resolve<CacheService>('CacheService');
      if (cacheService) {
        await cacheService.shutdown();
      }

      console.log('✅ Cache services shutdown successfully');
    } catch (error) {
      console.error('❌ Error shutting down cache services:', error);
    }
  }

  /**
   * Health check for cache services
   */
  static async healthCheck(container: Container): Promise<{ status: string; details: any }> {
    try {
      const cacheService = container.resolve<CacheService>('CacheService');
      if (!cacheService) {
        return {
          status: 'unavailable',
          details: { error: 'Cache service not registered' }
        };
      }

      return await cacheService.healthCheck();
    } catch (error) {
      return {
        status: 'error',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }
}

/**
 * Mock Cache Repository for testing without Redis
 */
class MockCacheRepository implements CacheRepository {
  private data = new Map<string, any>();

  async connect(): Promise<void> { }
  async disconnect(): Promise<void> { }
  isConnected(): boolean { return true; }
  async ping(): Promise<boolean> { return true; }

  async get<T>(key: string): Promise<T | null> {
    return this.data.get(key) || null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.data.set(key, value);
  }

  async del(key: string): Promise<boolean> {
    return this.data.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    return this.data.has(key);
  }

  async mget<T>(keys: string[]): Promise<{ found: Map<string, T>; missing: string[] }> {
    const found = new Map<string, T>();
    const missing: string[] = [];

    keys.forEach(key => {
      if (this.data.has(key)) {
        found.set(key, this.data.get(key));
      } else {
        missing.push(key);
      }
    });

    return { found, missing };
  }

  async mset<T>(keyValuePairs: Map<string, T>): Promise<void> {
    keyValuePairs.forEach((value, key) => {
      this.data.set(key, value);
    });
  }

  async mdel(keys: string[]): Promise<number> {
    let deleted = 0;
    keys.forEach(key => {
      if (this.data.delete(key)) {
        deleted++;
      }
    });
    return deleted;
  }

  async expire(): Promise<boolean> { return true; }
  async ttl(): Promise<number> { return -1; }
  async increment(): Promise<number> { return 1; }
  async decrement(): Promise<number> { return -1; }
  async keys(): Promise<string[]> { return Array.from(this.data.keys()); }
  async deleteByPattern(): Promise<number> { return 0; }
  async clear(): Promise<void> { this.data.clear(); }
  async flushDatabase(): Promise<void> { this.data.clear(); }

  async getStats(): Promise<any> {
    return {
      hits: 0,
      misses: 0,
      keys: this.data.size,
      memory: '0MB'
    };
  }

  async getCacheResult<T>(key: string): Promise<any> {
    const value = await this.get<T>(key);
    return { hit: value !== null, key, value };
  }

  getKeyManager(): any { return {}; }
  getClient(): any { return {}; }
  getInternalStats(): any { return {}; }
}

/**
 * Mock Cache Service for testing
 */
class MockCacheService {
  async initialize(): Promise<void> { }
  async shutdown(): Promise<void> { }

  async healthCheck(): Promise<{ status: string; details: any }> {
    return {
      status: 'mock',
      details: { message: 'Using mock cache for testing' }
    };
  }

  // Mock all cache methods
  async cacheSkill(): Promise<void> { }
  async getSkill(): Promise<any | null> { return null; }
  async cacheUserProfile(): Promise<void> { }
  async getUserProfile(): Promise<any | null> { return null; }
  async cacheUserSkills(): Promise<void> { }
  async getUserSkills(): Promise<any[] | null> { return null; }
  async invalidateUser(): Promise<void> { }
  async isHealthy(): Promise<boolean> { return true; }
}

/**
 * Helper function to get cache service from container
 */
export function getCacheService(container: Container): CacheService | null {
  try {
    return container.resolve<CacheService>('CacheService');
  } catch {
    return null;
  }
}

/**
 * Helper function to get cache repository from container
 */
export function getCacheRepository(container: Container): CacheRepository | null {
  try {
    return container.resolve<CacheRepository>('CacheRepository');
  } catch {
    return null;
  }
}
