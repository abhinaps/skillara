import { CacheConfig, CacheEvents } from './interfaces/CacheRepository';

/**
 * Cache Configuration Factory
 * Provides standardized cache configurations for different environments
 */
export class CacheConfigFactory {

  /**
   * Create development cache configuration
   */
  static createDevelopmentConfig(): CacheConfig {
    return {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      database: parseInt(process.env.REDIS_DB || '0'),
      keyPrefix: process.env.REDIS_KEY_PREFIX || 'skillara:dev:',
      defaultTTL: parseInt(process.env.REDIS_DEFAULT_TTL || '3600'), // 1 hour
      maxRetries: 3,
      connectTimeout: 10000,
      lazyConnect: true
    };
  }

  /**
   * Create production cache configuration
   */
  static createProductionConfig(): CacheConfig {
    return {
      host: process.env.REDIS_HOST || 'redis',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      database: parseInt(process.env.REDIS_DB || '0'),
      keyPrefix: process.env.REDIS_KEY_PREFIX || 'skillara:prod:',
      defaultTTL: parseInt(process.env.REDIS_DEFAULT_TTL || '7200'), // 2 hours
      maxRetries: 5,
      connectTimeout: 5000,
      lazyConnect: true
    };
  }

  /**
   * Create test cache configuration
   */
  static createTestConfig(): CacheConfig {
    return {
      host: process.env.REDIS_TEST_HOST || 'localhost',
      port: parseInt(process.env.REDIS_TEST_PORT || '6379'),
      password: process.env.REDIS_TEST_PASSWORD,
      database: parseInt(process.env.REDIS_TEST_DB || '1'),
      keyPrefix: process.env.REDIS_TEST_KEY_PREFIX || 'skillara:test:',
      defaultTTL: parseInt(process.env.REDIS_TEST_DEFAULT_TTL || '300'), // 5 minutes
      maxRetries: 2,
      connectTimeout: 5000,
      lazyConnect: true
    };
  }

  /**
   * Create cache configuration based on NODE_ENV
   */
  static createConfig(): CacheConfig {
    const env = process.env.NODE_ENV || 'development';

    switch (env) {
      case 'production':
        return this.createProductionConfig();
      case 'test':
        return this.createTestConfig();
      default:
        return this.createDevelopmentConfig();
    }
  }

  /**
   * Create cache events handlers with logging
   */
  static createCacheEvents(): CacheEvents {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
      onHit: (key, value) => {
        if (!isProduction) {
          console.log(`🎯 Cache HIT: ${key}`);
        }
      },

      onMiss: (key) => {
        if (!isProduction) {
          console.log(`❌ Cache MISS: ${key}`);
        }
      },

      onSet: (key, value, ttl) => {
        if (!isProduction) {
          const ttlInfo = ttl ? ` (TTL: ${ttl}s)` : '';
          console.log(`💾 Cache SET: ${key}${ttlInfo}`);
        }
      },

      onDelete: (key) => {
        if (!isProduction) {
          console.log(`🗑️ Cache DELETE: ${key}`);
        }
      },

      onError: (error, operation, key) => {
        const keyInfo = key ? ` [${key}]` : '';
        console.error(`⚠️ Cache ERROR (${operation})${keyInfo}:`, error.message);

        // In production, you might want to send this to monitoring service
        if (isProduction) {
          // TODO: Integrate with monitoring service (e.g., DataDog, New Relic)
          // monitoringService.captureException(error, { operation, key });
        }
      }
    };
  }

  /**
   * Validate cache configuration
   */
  static validateConfig(config: CacheConfig): void {
    if (!config.host) {
      throw new Error('Redis host is required');
    }

    if (!config.port || config.port < 1 || config.port > 65535) {
      throw new Error('Redis port must be between 1 and 65535');
    }

    if (config.database !== undefined && (config.database < 0 || config.database > 15)) {
      throw new Error('Redis database must be between 0 and 15');
    }

    if (config.defaultTTL !== undefined && config.defaultTTL < 0) {
      throw new Error('Default TTL must be non-negative');
    }

    if (config.connectTimeout !== undefined && config.connectTimeout < 1000) {
      throw new Error('Connect timeout must be at least 1000ms');
    }
  }
}

/**
 * Environment Variables Documentation
 *
 * Add these to your .env file:
 *
 * # Redis Configuration
 * REDIS_HOST=localhost
 * REDIS_PORT=6379
 * REDIS_PASSWORD=your_password_here
 * REDIS_DB=0
 * REDIS_KEY_PREFIX=skillara:dev:
 * REDIS_DEFAULT_TTL=3600
 *
 * # Test Environment
 * REDIS_TEST_HOST=localhost
 * REDIS_TEST_PORT=6379
 * REDIS_TEST_PASSWORD=
 * REDIS_TEST_DB=1
 * REDIS_TEST_KEY_PREFIX=skillara:test:
 * REDIS_TEST_DEFAULT_TTL=300
 *
 * # General
 * NODE_ENV=development
 */
