import { CacheRepository } from './interfaces/CacheRepository';
import { RedisRepository } from './RedisRepository';
import { CacheConfigFactory } from './CacheConfigFactory';
import { CacheKeyManager } from './CacheKeyManager';
import { CacheStatsTracker } from './CacheDecorator';

/**
 * Cache Service - High-level cache management
 * Provides domain-specific caching operations and cache coordination
 */
export class CacheService {
  private cache: CacheRepository;
  private keyManager: CacheKeyManager;
  private statsTracker: CacheStatsTracker;

  constructor(cache?: CacheRepository) {
    // Use provided cache or create default Redis cache
    if (cache) {
      this.cache = cache;
    } else {
      const config = CacheConfigFactory.createConfig();
      const events = CacheConfigFactory.createCacheEvents();
      this.cache = new RedisRepository(config, events);
    }

    this.keyManager = new CacheKeyManager();
    this.statsTracker = new CacheStatsTracker();
  }

  /**
   * Initialize cache service
   */
  async initialize(): Promise<void> {
    try {
      if (!this.cache.isConnected()) {
        await this.cache.connect();
      }

      const pingSuccess = await this.cache.ping();
      if (!pingSuccess) {
        throw new Error('Cache ping failed');
      }

      console.log('✅ Cache service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize cache service:', error);
      throw error;
    }
  }

  /**
   * Shutdown cache service
   */
  async shutdown(): Promise<void> {
    try {
      await this.cache.disconnect();
      console.log('✅ Cache service shutdown successfully');
    } catch (error) {
      console.error('❌ Error during cache service shutdown:', error);
      throw error;
    }
  }

  /**
   * Health check for cache service
   */
  async healthCheck(): Promise<{ status: string; details: any }> {
    try {
      const isConnected = this.cache.isConnected();
      const pingSuccess = await this.cache.ping();
      const stats = await this.cache.getStats();

      const status = isConnected && pingSuccess ? 'healthy' : 'unhealthy';

      return {
        status,
        details: {
          connected: isConnected,
          ping: pingSuccess,
          stats,
          tracker: this.statsTracker.getStats()
        }
      };
    } catch (error) {
      return {
        status: 'error',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          connected: false,
          ping: false
        }
      };
    }
  }

  // =================
  // SKILL CACHING
  // =================

  /**
   * Cache skill by ID
   */
  async cacheSkill(skillId: string, skill: any, ttl?: number): Promise<void> {
    const key = this.keyManager.skill.byId(skillId);
    await this.cache.set(key, skill, { ttl: ttl || this.keyManager.ttl.SKILL_DATA });
  }

  /**
   * Get skill from cache
   */
  async getSkill(skillId: string): Promise<any | null> {
    const key = this.keyManager.skill.byId(skillId);
    const result = await this.cache.get(key);

    if (result) {
      this.statsTracker.recordHit();
    } else {
      this.statsTracker.recordMiss();
    }

    return result;
  }

  /**
   * Cache skills list
   */
  async cacheSkillsList(category: string, skills: any[], ttl?: number): Promise<void> {
    const key = this.keyManager.skill.byCategory(category);
    await this.cache.set(key, skills, { ttl: ttl || this.keyManager.ttl.CATEGORIES });
  }

  /**
   * Get skills list from cache
   */
  async getSkillsList(category: string): Promise<any[] | null> {
    const key = this.keyManager.skill.byCategory(category);
    return await this.cache.get(key);
  }

  /**
   * Invalidate skill cache
   */
  async invalidateSkill(skillId: string): Promise<void> {
    const key = this.keyManager.skill.byId(skillId);
    await this.cache.del(key);

    // Also invalidate related lists
    const pattern = this.keyManager.patterns.allSkills();
    await this.cache.deleteByPattern(pattern);
  }

  // =================
  // USER CACHING
  // =================

  /**
   * Cache user profile
   */
  async cacheUserProfile(userId: string, profile: any, ttl?: number): Promise<void> {
    const key = this.keyManager.user.profile(userId);
    await this.cache.set(key, profile, { ttl: ttl || this.keyManager.ttl.MEDIUM });
  }

  /**
   * Get user profile from cache
   */
  async getUserProfile(userId: string): Promise<any | null> {
    const key = this.keyManager.user.profile(userId);
    return await this.cache.get(key);
  }

  /**
   * Cache user skills
   */
  async cacheUserSkills(userId: string, skills: any[], ttl?: number): Promise<void> {
    const key = this.keyManager.user.skills(userId);
    await this.cache.set(key, skills, { ttl: ttl || this.keyManager.ttl.USER_SKILLS });
  }

  /**
   * Get user skills from cache
   */
  async getUserSkills(userId: string): Promise<any[] | null> {
    const key = this.keyManager.user.skills(userId);
    return await this.cache.get(key);
  }

  /**
   * Invalidate user cache
   */
  async invalidateUser(userId: string): Promise<void> {
    const patterns = [
      this.keyManager.user.profile(userId),
      this.keyManager.user.skills(userId),
      this.keyManager.user.assessments(userId),
      this.keyManager.user.analytics(userId)
    ];

    for (const pattern of patterns) {
      await this.cache.del(pattern);
    }
  }

  // =================
  // ASSESSMENT CACHING
  // =================

  /**
   * Cache assessment result
   */
  async cacheAssessment(assessmentId: string, result: any, ttl?: number): Promise<void> {
    const key = this.keyManager.assessment.byId(assessmentId);
    await this.cache.set(key, result, { ttl: ttl || this.keyManager.ttl.LONG });
  }

  /**
   * Get assessment from cache
   */
  async getAssessment(assessmentId: string): Promise<any | null> {
    const key = this.keyManager.assessment.byId(assessmentId);
    return await this.cache.get(key);
  }

  /**
   * Cache user assessments list
   */
  async cacheUserAssessments(userId: string, assessments: any[], ttl?: number): Promise<void> {
    const key = this.keyManager.user.assessments(userId);
    await this.cache.set(key, assessments, { ttl: ttl || this.keyManager.ttl.MEDIUM });
  }

  /**
   * Get user assessments from cache
   */
  async getUserAssessments(userId: string): Promise<any[] | null> {
    const key = this.keyManager.user.assessments(userId);
    return await this.cache.get(key);
  }

  // =================
  // STATISTICS CACHING
  // =================

  /**
   * Cache skill statistics
   */
  async cacheSkillStats(skillId: string, stats: any, ttl?: number): Promise<void> {
    const key = this.keyManager.stats.popularSkills();
    await this.cache.set(key, stats, { ttl: ttl || this.keyManager.ttl.ANALYTICS });
  }

  /**
   * Get skill statistics from cache
   */
  async getSkillStats(skillId: string): Promise<any | null> {
    const key = this.keyManager.stats.popularSkills();
    return await this.cache.get(key);
  }

  /**
   * Cache global statistics
   */
  async cacheGlobalStats(stats: any, ttl?: number): Promise<void> {
    const key = this.keyManager.stats.marketTrends();
    await this.cache.set(key, stats, { ttl: ttl || this.keyManager.ttl.LONG });
  }

  /**
   * Get global statistics from cache
   */
  async getGlobalStats(): Promise<any | null> {
    const key = this.keyManager.stats.marketTrends();
    return await this.cache.get(key);
  }

  // =================
  // SESSION CACHING
  // =================

  /**
   * Cache user session
   */
  async cacheSession(sessionId: string, sessionData: any, ttl?: number): Promise<void> {
    const key = this.keyManager.session.userSession(sessionId);
    await this.cache.set(key, sessionData, { ttl: ttl || this.keyManager.ttl.SESSION_DATA });
  }

  /**
   * Get user session from cache
   */
  async getSession(sessionId: string): Promise<any | null> {
    const key = this.keyManager.session.userSession(sessionId);
    return await this.cache.get(key);
  }

  /**
   * Invalidate session
   */
  async invalidateSession(sessionId: string): Promise<void> {
    const key = this.keyManager.session.userSession(sessionId);
    await this.cache.del(key);
  }

  // =================
  // BULK OPERATIONS
  // =================

  /**
   * Cache multiple items at once
   */
  async cacheBulk(items: Map<string, any>, ttl?: number): Promise<void> {
    await this.cache.mset(items, { ttl });
  }

  /**
   * Get multiple items from cache
   */
  async getBulk<T>(keys: string[]): Promise<Map<string, T>> {
    const result = await this.cache.mget<T>(keys);
    return result.found;
  }

  /**
   * Invalidate multiple cache entries
   */
  async invalidateBulk(patterns: string[]): Promise<void> {
    for (const pattern of patterns) {
      if (pattern.includes('*')) {
        await this.cache.deleteByPattern(pattern);
      } else {
        await this.cache.del(pattern);
      }
    }
  }

  // =================
  // UTILITY METHODS
  // =================

  /**
   * Clear all cache (use with caution!)
   */
  async clearAll(): Promise<void> {
    await this.cache.clear();
    this.statsTracker.reset();
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<any> {
    const cacheStats = await this.cache.getStats();
    const trackerStats = this.statsTracker.getStats();

    return {
      cache: cacheStats,
      tracker: trackerStats,
      combined: {
        hitRate: trackerStats.hitRate,
        totalOperations: trackerStats.operations,
        totalKeys: cacheStats.keys,
        memoryUsage: cacheStats.memory
      }
    };
  }

  /**
   * Get key manager instance
   */
  getKeyManager(): CacheKeyManager {
    return this.keyManager;
  }

  /**
   * Get cache repository instance
   */
  getCacheRepository(): CacheRepository {
    return this.cache;
  }

  /**
   * Check if cache is available and healthy
   */
  async isHealthy(): Promise<boolean> {
    try {
      return this.cache.isConnected() && await this.cache.ping();
    } catch {
      return false;
    }
  }
}
