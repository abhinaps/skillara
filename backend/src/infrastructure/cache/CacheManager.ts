import { CacheRepository } from './interfaces/CacheRepository';
import { RedisRepository } from './RedisRepository';
import { CacheService } from './CacheService';
import { CacheConfigFactory } from './CacheConfigFactory';

/**
 * Cache Manager - Singleton pattern for cache services
 * Following the existing DIContainer pattern
 */
export class CacheManager {
  private static instance: CacheManager;
  private _cacheRepository!: CacheRepository;
  private _cacheService!: CacheService;
  private _isInitialized = false;

  private constructor() {}

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * Initialize cache services
   */
  async initialize(): Promise<void> {
    if (this._isInitialized) {
      return;
    }

    console.log('🔄 Initializing cache services...');

    try {
      // Create cache configuration
      const cacheConfig = CacheConfigFactory.createConfig();
      CacheConfigFactory.validateConfig(cacheConfig);

      // Create cache events handlers
      const cacheEvents = CacheConfigFactory.createCacheEvents();

      // Initialize Redis Repository
      this._cacheRepository = new RedisRepository(cacheConfig, cacheEvents);

      // Initialize Cache Service
      this._cacheService = new CacheService(this._cacheRepository);
      await this._cacheService.initialize();

      this._isInitialized = true;
      console.log('✅ Cache services initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize cache services:', error);
      console.warn('⚠️ Continuing without cache functionality');

      // Initialize mock services as fallback
      this._cacheRepository = new MockCacheRepository();
      this._cacheService = new MockCacheService();
      this._isInitialized = true;
    }
  }

  /**
   * Initialize cache services for testing environment
   */
  async initializeForTesting(): Promise<void> {
    console.log('🧪 Initializing cache services for testing...');

    try {
      // Use test configuration
      const cacheConfig = CacheConfigFactory.createTestConfig();
      CacheConfigFactory.validateConfig(cacheConfig);

      const cacheEvents = CacheConfigFactory.createCacheEvents();

      // Initialize test Redis Repository
      this._cacheRepository = new RedisRepository(cacheConfig, cacheEvents);

      // Initialize test Cache Service
      this._cacheService = new CacheService(this._cacheRepository);
      await this._cacheService.initialize();

      this._isInitialized = true;
      console.log('✅ Test cache services initialized successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn('⚠️ Cache not available for testing, using mock services:', errorMessage);

      // Use mock cache service for testing
      this._cacheRepository = new MockCacheRepository();
      this._cacheService = new MockCacheService();
      this._isInitialized = true;
    }
  }

  /**
   * Gracefully shutdown cache services
   */
  async shutdown(): Promise<void> {
    if (!this._isInitialized) {
      return;
    }

    console.log('🔄 Shutting down cache services...');

    try {
      if (this._cacheService && typeof this._cacheService.shutdown === 'function') {
        await this._cacheService.shutdown();
      }

      this._isInitialized = false;
      console.log('✅ Cache services shutdown successfully');
    } catch (error) {
      console.error('❌ Error shutting down cache services:', error);
    }
  }

  /**
   * Health check for cache services
   */
  async healthCheck(): Promise<{ status: string; details: any }> {
    if (!this._isInitialized) {
      return {
        status: 'not_initialized',
        details: { error: 'Cache services not initialized' }
      };
    }

    try {
      if (this._cacheService && typeof this._cacheService.healthCheck === 'function') {
        return await this._cacheService.healthCheck();
      }

      return {
        status: 'mock',
        details: { message: 'Using mock cache services' }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        status: 'error',
        details: { error: errorMessage }
      };
    }
  }

  // Getters for accessing instances
  get cacheRepository(): CacheRepository {
    if (!this._isInitialized) {
      throw new Error('Cache services not initialized. Call initialize() first.');
    }
    return this._cacheRepository;
  }

  get cacheService(): CacheService {
    if (!this._isInitialized) {
      throw new Error('Cache services not initialized. Call initialize() first.');
    }
    return this._cacheService;
  }

  get isInitialized(): boolean {
    return this._isInitialized;
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
class MockCacheService extends CacheService {
  constructor() {
    super(new MockCacheRepository());
  }

  async initialize(): Promise<void> { }
  async shutdown(): Promise<void> { }

  async healthCheck(): Promise<{ status: string; details: any }> {
    return {
      status: 'mock',
      details: { message: 'Using mock cache for testing' }
    };
  }

  async isHealthy(): Promise<boolean> { return true; }
}

/**
 * Helper function to get cache service safely
 */
export function getCacheService(): CacheService | null {
  try {
    const cacheManager = CacheManager.getInstance();
    return cacheManager.isInitialized ? cacheManager.cacheService : null;
  } catch {
    return null;
  }
}

/**
 * Helper function to get cache repository safely
 */
export function getCacheRepository(): CacheRepository | null {
  try {
    const cacheManager = CacheManager.getInstance();
    return cacheManager.isInitialized ? cacheManager.cacheRepository : null;
  } catch {
    return null;
  }
}
