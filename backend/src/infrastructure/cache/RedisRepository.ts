import Redis from 'ioredis';
import {
  CacheRepository,
  CacheOptions,
  CacheStats,
  BatchCacheResult,
  CacheEvents,
  CacheConfig,
  CacheResult
} from './interfaces/CacheRepository';
import { CacheKeyManager } from './CacheKeyManager';

/**
 * Redis Cache Repository Implementation
 * Provides Redis-based caching with connection management, error handling, and monitoring
 */
export class RedisRepository implements CacheRepository {
  private redis!: Redis;
  private keyManager: CacheKeyManager;
  private events?: CacheEvents;
  private isConnectedFlag: boolean = false;
  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    errors: 0
  };

  constructor(
    private config: CacheConfig,
    events?: CacheEvents
  ) {
    this.keyManager = new CacheKeyManager();
    this.events = events;
    this.setupRedisClient();
  }

  /**
   * Setup Redis client with configuration
   */
  private setupRedisClient(): void {
    const redisOptions = {
      host: this.config.host,
      port: this.config.port,
      ...(this.config.password && { password: this.config.password }),
      db: this.config.database || 0,
      ...(this.config.maxRetries && { maxRetriesPerRequest: this.config.maxRetries }),
      connectTimeout: this.config.connectTimeout || 10000,
      lazyConnect: this.config.lazyConnect || true,
      ...(this.config.keyPrefix && { keyPrefix: this.config.keyPrefix }),
      reconnectOnError: (err: Error) => {
        const targetError = 'READONLY';
        return err.message.includes(targetError);
      }
    };

    this.redis = new Redis(redisOptions);

    // Event listeners
    this.redis.on('connect', () => {
      this.isConnectedFlag = true;
      console.log('✅ Redis connected successfully');
    });

    this.redis.on('ready', () => {
      console.log('🚀 Redis is ready for operations');
    });

    this.redis.on('error', (error) => {
      this.isConnectedFlag = false;
      this.stats.errors++;
      console.error('❌ Redis connection error:', error);
      this.events?.onError(error, 'connection');
    });

    this.redis.on('close', () => {
      this.isConnectedFlag = false;
      console.log('🔌 Redis connection closed');
    });

    this.redis.on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...');
    });
  }

  /**
   * Connect to Redis
   */
  async connect(): Promise<void> {
    try {
      await this.redis.connect();
      this.isConnectedFlag = true;
    } catch (error) {
      this.isConnectedFlag = false;
      console.error('❌ Failed to connect to Redis:', error);
      throw error;
    }
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    try {
      await this.redis.quit();
      this.isConnectedFlag = false;
    } catch (error) {
      console.error('❌ Error during Redis disconnect:', error);
      throw error;
    }
  }

  /**
   * Check if connected to Redis
   */
  isConnected(): boolean {
    return this.isConnectedFlag && this.redis.status === 'ready';
  }

  /**
   * Ping Redis server
   */
  async ping(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      return result === 'PONG';
    } catch (error) {
      this.events?.onError(error as Error, 'ping');
      return false;
    }
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);

      if (value === null) {
        this.stats.misses++;
        this.events?.onMiss(key);
        return null;
      }

      this.stats.hits++;
      const parsed = JSON.parse(value) as T;
      this.events?.onHit(key, parsed);
      return parsed;
    } catch (error) {
      this.stats.errors++;
      this.events?.onError(error as Error, 'get', key);
      throw error;
    }
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      const ttl = options?.ttl || this.config.defaultTTL;

      if (ttl) {
        await this.redis.setex(key, ttl, serialized);
      } else {
        await this.redis.set(key, serialized);
      }

      this.stats.sets++;
      this.events?.onSet(key, value, ttl);
    } catch (error) {
      this.stats.errors++;
      this.events?.onError(error as Error, 'set', key);
      throw error;
    }
  }

  /**
   * Delete key from cache
   */
  async del(key: string): Promise<boolean> {
    try {
      const result = await this.redis.del(key);
      const deleted = result > 0;

      if (deleted) {
        this.stats.deletes++;
        this.events?.onDelete(key);
      }

      return deleted;
    } catch (error) {
      this.stats.errors++;
      this.events?.onError(error as Error, 'delete', key);
      throw error;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      this.stats.errors++;
      this.events?.onError(error as Error, 'exists', key);
      throw error;
    }
  }

  /**
   * Get multiple keys
   */
  async mget<T>(keys: string[]): Promise<BatchCacheResult<T>> {
    try {
      const values = await this.redis.mget(...keys);
      const found = new Map<string, T>();
      const missing: string[] = [];

      values.forEach((value, index) => {
        const key = keys[index];
        if (value !== null) {
          try {
            found.set(key, JSON.parse(value) as T);
            this.stats.hits++;
            this.events?.onHit(key, found.get(key));
          } catch (parseError) {
            missing.push(key);
            this.stats.misses++;
            this.events?.onMiss(key);
          }
        } else {
          missing.push(key);
          this.stats.misses++;
          this.events?.onMiss(key);
        }
      });

      return { found, missing };
    } catch (error) {
      this.stats.errors++;
      this.events?.onError(error as Error, 'mget');
      throw error;
    }
  }

  /**
   * Set multiple key-value pairs
   */
  async mset<T>(keyValuePairs: Map<string, T>, options?: CacheOptions): Promise<void> {
    try {
      const pipeline = this.redis.pipeline();
      const ttl = options?.ttl || this.config.defaultTTL;

      keyValuePairs.forEach((value, key) => {
        const serialized = JSON.stringify(value);
        if (ttl) {
          pipeline.setex(key, ttl, serialized);
        } else {
          pipeline.set(key, serialized);
        }
        this.events?.onSet(key, value, ttl);
      });

      await pipeline.exec();
      this.stats.sets += keyValuePairs.size;
    } catch (error) {
      this.stats.errors++;
      this.events?.onError(error as Error, 'mset');
      throw error;
    }
  }

  /**
   * Delete multiple keys
   */
  async mdel(keys: string[]): Promise<number> {
    try {
      const result = await this.redis.del(...keys);
      this.stats.deletes += result;

      keys.forEach(key => {
        this.events?.onDelete(key);
      });

      return result;
    } catch (error) {
      this.stats.errors++;
      this.events?.onError(error as Error, 'mdel');
      throw error;
    }
  }

  /**
   * Set TTL for existing key
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      const result = await this.redis.expire(key, ttl);
      return result === 1;
    } catch (error) {
      this.stats.errors++;
      this.events?.onError(error as Error, 'expire', key);
      throw error;
    }
  }

  /**
   * Get TTL for key
   */
  async ttl(key: string): Promise<number> {
    try {
      return await this.redis.ttl(key);
    } catch (error) {
      this.stats.errors++;
      this.events?.onError(error as Error, 'ttl', key);
      throw error;
    }
  }

  /**
   * Increment numeric value
   */
  async increment(key: string, value: number = 1): Promise<number> {
    try {
      return await this.redis.incrby(key, value);
    } catch (error) {
      this.stats.errors++;
      this.events?.onError(error as Error, 'increment', key);
      throw error;
    }
  }

  /**
   * Decrement numeric value
   */
  async decrement(key: string, value: number = 1): Promise<number> {
    try {
      return await this.redis.decrby(key, value);
    } catch (error) {
      this.stats.errors++;
      this.events?.onError(error as Error, 'decrement', key);
      throw error;
    }
  }

  /**
   * Get keys matching pattern
   */
  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.redis.keys(pattern);
    } catch (error) {
      this.stats.errors++;
      this.events?.onError(error as Error, 'keys');
      throw error;
    }
  }

  /**
   * Delete keys matching pattern
   */
  async deleteByPattern(pattern: string): Promise<number> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length === 0) return 0;

      return await this.mdel(keys);
    } catch (error) {
      this.stats.errors++;
      this.events?.onError(error as Error, 'deleteByPattern');
      throw error;
    }
  }

  /**
   * Clear all cache data (use with caution!)
   */
  async clear(): Promise<void> {
    try {
      await this.redis.flushdb();
    } catch (error) {
      this.stats.errors++;
      this.events?.onError(error as Error, 'clear');
      throw error;
    }
  }

  /**
   * Flush entire Redis database (use with extreme caution!)
   */
  async flushDatabase(): Promise<void> {
    try {
      await this.redis.flushall();
    } catch (error) {
      this.stats.errors++;
      this.events?.onError(error as Error, 'flushDatabase');
      throw error;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<CacheStats> {
    try {
      const info = await this.redis.info('memory');
      const memoryMatch = info.match(/used_memory_human:(.+)/);
      const memory = memoryMatch ? memoryMatch[1].trim() : 'unknown';

      const keyCount = await this.redis.dbsize();

      return {
        hits: this.stats.hits,
        misses: this.stats.misses,
        keys: keyCount,
        memory
      };
    } catch (error) {
      this.stats.errors++;
      this.events?.onError(error as Error, 'getStats');
      throw error;
    }
  }

  /**
   * Get cache result with hit/miss tracking
   */
  async getCacheResult<T>(key: string): Promise<CacheResult<T>> {
    const value = await this.get<T>(key);
    return value !== null
      ? CacheResult.hit(key, value)
      : CacheResult.miss<T>(key);
  }

  /**
   * Get key manager instance
   */
  getKeyManager(): CacheKeyManager {
    return this.keyManager;
  }

  /**
   * Get internal Redis client (for advanced operations)
   */
  getClient(): Redis {
    return this.redis;
  }

  /**
   * Get internal statistics
   */
  getInternalStats() {
    return { ...this.stats };
  }
}
