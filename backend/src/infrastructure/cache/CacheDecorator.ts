import { CacheRepository } from './interfaces/CacheRepository';
import { CacheKeyManager } from './CacheKeyManager';

/**
 * Cache decorator for repository methods
 * Provides transparent caching with automatic invalidation
 */
export class CacheDecorator {
  constructor(
    private cache: CacheRepository,
    private keyManager: CacheKeyManager
  ) {}

  /**
   * Cacheable decorator - wraps repository methods with caching
   */
  static Cacheable(options: {
    keyGenerator: (args: any[]) => string;
    ttl?: number;
    condition?: (args: any[]) => boolean;
  }) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;

      descriptor.value = async function (...args: any[]) {
        // Get cache instance from DI container or inject it
        const cacheInstance = (this as any).cache as CacheRepository;

        if (!cacheInstance) {
          // No cache available, execute original method
          return await originalMethod.apply(this, args);
        }

        // Check condition if provided
        if (options.condition && !options.condition(args)) {
          return await originalMethod.apply(this, args);
        }

        const cacheKey = options.keyGenerator(args);

        try {
          // Try to get from cache first
          const cachedResult = await cacheInstance.get(cacheKey);
          if (cachedResult !== null) {
            console.log(`🎯 Cache hit for ${propertyName}: ${cacheKey}`);
            return cachedResult;
          }

          // Cache miss - execute original method
          console.log(`❌ Cache miss for ${propertyName}: ${cacheKey}`);
          const result = await originalMethod.apply(this, args);

          // Cache the result if it's not null/undefined
          if (result !== null && result !== undefined) {
            await cacheInstance.set(cacheKey, result, { ttl: options.ttl });
            console.log(`💾 Cached result for ${propertyName}: ${cacheKey}`);
          }

          return result;
        } catch (cacheError) {
          console.error(`⚠️ Cache error in ${propertyName}:`, cacheError);
          // Fallback to original method if cache fails
          return await originalMethod.apply(this, args);
        }
      };

      return descriptor;
    };
  }

  /**
   * Cache Evict decorator - invalidates cache entries
   */
  static CacheEvict(options: {
    keyGenerator?: (args: any[]) => string;
    patterns?: string[];
    allEntries?: boolean;
    beforeInvocation?: boolean;
  }) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;

      descriptor.value = async function (...args: any[]) {
        const cacheInstance = (this as any).cache as CacheRepository;

        if (!cacheInstance) {
          return await originalMethod.apply(this, args);
        }

        const evictCache = async () => {
          try {
            if (options.allEntries) {
              // Clear all cache entries
              await cacheInstance.clear();
              console.log(`🗑️ Cleared all cache entries for ${propertyName}`);
            } else if (options.patterns) {
              // Delete by patterns
              for (const pattern of options.patterns) {
                const deletedCount = await cacheInstance.deleteByPattern(pattern);
                console.log(`🗑️ Deleted ${deletedCount} cache entries matching ${pattern}`);
              }
            } else if (options.keyGenerator) {
              // Delete specific key
              const cacheKey = options.keyGenerator(args);
              const deleted = await cacheInstance.del(cacheKey);
              if (deleted) {
                console.log(`🗑️ Deleted cache entry: ${cacheKey}`);
              }
            }
          } catch (error) {
            console.error(`⚠️ Cache eviction error in ${propertyName}:`, error);
          }
        };

        if (options.beforeInvocation) {
          await evictCache();
        }

        const result = await originalMethod.apply(this, args);

        if (!options.beforeInvocation) {
          await evictCache();
        }

        return result;
      };

      return descriptor;
    };
  }

  /**
   * Cache Put decorator - always updates cache with result
   */
  static CachePut(options: {
    keyGenerator: (args: any[]) => string;
    ttl?: number;
    condition?: (args: any[], result: any) => boolean;
  }) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;

      descriptor.value = async function (...args: any[]) {
        const result = await originalMethod.apply(this, args);
        const cacheInstance = (this as any).cache as CacheRepository;

        if (!cacheInstance) {
          return result;
        }

        try {
          // Check condition if provided
          if (options.condition && !options.condition(args, result)) {
            return result;
          }

          const cacheKey = options.keyGenerator(args);

          if (result !== null && result !== undefined) {
            await cacheInstance.set(cacheKey, result, { ttl: options.ttl });
            console.log(`💾 Updated cache for ${propertyName}: ${cacheKey}`);
          }
        } catch (error) {
          console.error(`⚠️ Cache put error in ${propertyName}:`, error);
        }

        return result;
      };

      return descriptor;
    };
  }
}

/**
 * Cache-aware base repository class
 * Provides cache integration for repositories
 */
export abstract class CacheAwareRepository {
  protected cache?: CacheRepository;
  protected keyManager: CacheKeyManager;

  constructor(cache?: CacheRepository) {
    this.cache = cache;
    this.keyManager = new CacheKeyManager();
  }

  /**
   * Get from cache or execute function
   */
  protected async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    if (!this.cache) {
      return await fetcher();
    }

    try {
      const cached = await this.cache.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      const result = await fetcher();
      if (result !== null && result !== undefined) {
        await this.cache.set(key, result, { ttl });
      }

      return result;
    } catch (cacheError) {
      console.error('Cache error:', cacheError);
      return await fetcher();
    }
  }

  /**
   * Invalidate cache by key
   */
  protected async invalidateCache(key: string): Promise<void> {
    if (this.cache) {
      try {
        await this.cache.del(key);
      } catch (error) {
        console.error('Cache invalidation error:', error);
      }
    }
  }

  /**
   * Invalidate cache by pattern
   */
  protected async invalidateCacheByPattern(pattern: string): Promise<void> {
    if (this.cache) {
      try {
        await this.cache.deleteByPattern(pattern);
      } catch (error) {
        console.error('Cache pattern invalidation error:', error);
      }
    }
  }

  /**
   * Batch cache operations
   */
  protected async batchGetOrSet<T>(
    keys: string[],
    fetcher: (missingKeys: string[]) => Promise<Map<string, T>>,
    ttl?: number
  ): Promise<Map<string, T>> {
    if (!this.cache) {
      return await fetcher(keys);
    }

    try {
      // Get cached values
      const batchResult = await this.cache.mget<T>(keys);
      const result = new Map(batchResult.found);

      // If all keys were found in cache, return early
      if (batchResult.missing.length === 0) {
        return result;
      }

      // Fetch missing values
      const fetchedValues = await fetcher(batchResult.missing);

      // Cache the fetched values
      if (fetchedValues.size > 0) {
        await this.cache.mset(fetchedValues, { ttl });
      }

      // Merge cached and fetched values
      fetchedValues.forEach((value, key) => {
        result.set(key, value);
      });

      return result;
    } catch (error) {
      console.error('Batch cache error:', error);
      return await fetcher(keys);
    }
  }
}

/**
 * Cache statistics tracker
 */
export class CacheStatsTracker {
  private stats = {
    hits: 0,
    misses: 0,
    operations: 0,
    errors: 0,
    lastReset: new Date()
  };

  recordHit(): void {
    this.stats.hits++;
    this.stats.operations++;
  }

  recordMiss(): void {
    this.stats.misses++;
    this.stats.operations++;
  }

  recordError(): void {
    this.stats.errors++;
  }

  getStats() {
    const hitRate = this.stats.operations > 0
      ? (this.stats.hits / this.stats.operations) * 100
      : 0;

    return {
      ...this.stats,
      hitRate: parseFloat(hitRate.toFixed(2)),
      uptime: Date.now() - this.stats.lastReset.getTime()
    };
  }

  reset(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      operations: 0,
      errors: 0,
      lastReset: new Date()
    };
  }
}
