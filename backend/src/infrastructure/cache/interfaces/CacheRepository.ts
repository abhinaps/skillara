/**
 * Cache Repository Interface
 * Defines the contract for cache operations in the Skillara application
 */

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string; // Key prefix for namespacing
}

export interface CacheStats {
  hits: number;
  misses: number;
  keys: number;
  memory: string;
}

export interface BatchCacheResult<T> {
  found: Map<string, T>;
  missing: string[];
}

/**
 * Generic cache repository interface
 */
export interface CacheRepository {
  // Basic Operations
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;
  del(key: string): Promise<boolean>;
  exists(key: string): Promise<boolean>;

  // Batch Operations
  mget<T>(keys: string[]): Promise<BatchCacheResult<T>>;
  mset<T>(keyValuePairs: Map<string, T>, options?: CacheOptions): Promise<void>;
  mdel(keys: string[]): Promise<number>;

  // Advanced Operations
  expire(key: string, ttl: number): Promise<boolean>;
  ttl(key: string): Promise<number>;
  increment(key: string, value?: number): Promise<number>;
  decrement(key: string, value?: number): Promise<number>;

  // Pattern Operations
  keys(pattern: string): Promise<string[]>;
  deleteByPattern(pattern: string): Promise<number>;

  // Cache Management
  clear(): Promise<void>;
  flushDatabase(): Promise<void>;
  getStats(): Promise<CacheStats>;

  // Connection Management
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;

  // Health Check
  ping(): Promise<boolean>;
}

/**
 * Cache events for monitoring and debugging
 */
export interface CacheEvents {
  onHit(key: string, value: any): void;
  onMiss(key: string): void;
  onSet(key: string, value: any, ttl?: number): void;
  onDelete(key: string): void;
  onError(error: Error, operation: string, key?: string): void;
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  database?: number;
  maxRetries?: number;
  retryDelayOnFailover?: number;
  connectTimeout?: number;
  lazyConnect?: boolean;
  keepAlive?: number;
  defaultTTL?: number;
  keyPrefix?: string;
  enableEvents?: boolean;
}

/**
 * Cache result wrapper for hit/miss tracking
 */
export class CacheResult<T> {
  constructor(
    public readonly value: T | null,
    public readonly isHit: boolean,
    public readonly key: string,
    public readonly retrievedAt: Date = new Date()
  ) {}

  static hit<T>(key: string, value: T): CacheResult<T> {
    return new CacheResult(value, true, key);
  }

  static miss<T>(key: string): CacheResult<T> {
    return new CacheResult<T>(null, false, key);
  }
}
