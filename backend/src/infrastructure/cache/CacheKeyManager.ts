/**
 * Cache Key Manager
 * Standardized key generation and management for Redis cache
 */

export class CacheKeyManager {
  private readonly separator = ':';
  private readonly appPrefix = 'skillara';

  /**
   * Generate a cache key with proper namespacing
   */
  public generateKey(namespace: string, identifier: string, ...subkeys: string[]): string {
    const parts = [this.appPrefix, namespace, identifier, ...subkeys];
    return parts.join(this.separator);
  }

  /**
   * Skills-related cache keys
   */
  public skill = {
    byId: (skillId: string) => this.generateKey('skill', skillId),
    byName: (skillName: string) => this.generateKey('skill', 'name', this.sanitizeKey(skillName)),
    byCategory: (category: string) => this.generateKey('skills', 'category', this.sanitizeKey(category)),
    allActive: () => this.generateKey('skills', 'active'),
    categories: () => this.generateKey('skills', 'categories'),
    search: (query: string) => this.generateKey('skills', 'search', this.sanitizeKey(query)),
    count: () => this.generateKey('skills', 'count'),
    trending: () => this.generateKey('skills', 'trending')
  };

  /**
   * User-related cache keys
   */
  public user = {
    skills: (userId: string) => this.generateKey('user', userId, 'skills'),
    assessments: (userId: string) => this.generateKey('user', userId, 'assessments'),
    analytics: (userId: string) => this.generateKey('user', userId, 'analytics'),
    profile: (userId: string) => this.generateKey('user', userId, 'profile')
  };

  /**
   * Assessment-related cache keys
   */
  public assessment = {
    byId: (assessmentId: string) => this.generateKey('assessment', assessmentId),
    byUserAndSkill: (userId: string, skillId: string) =>
      this.generateKey('assessment', userId, skillId),
    bySkill: (skillId: string) => this.generateKey('assessments', 'skill', skillId),
    recent: (limit: number = 10) => this.generateKey('assessments', 'recent', limit.toString())
  };

  /**
   * Analytics and statistics cache keys
   */
  public stats = {
    skillDemand: () => this.generateKey('stats', 'skill_demand'),
    userActivity: () => this.generateKey('stats', 'user_activity'),
    popularSkills: (timeframe: string = '24h') =>
      this.generateKey('stats', 'popular_skills', timeframe),
    marketTrends: () => this.generateKey('stats', 'market_trends'),
    categoryDistribution: () => this.generateKey('stats', 'category_distribution')
  };

  /**
   * Session and temporary cache keys
   */
  public session = {
    userSession: (sessionId: string) => this.generateKey('session', sessionId),
    searchResults: (sessionId: string, query: string) =>
      this.generateKey('session', sessionId, 'search', this.sanitizeKey(query)),
    tempData: (sessionId: string, dataType: string) =>
      this.generateKey('session', sessionId, 'temp', dataType)
  };

  /**
   * System and meta cache keys
   */
  public system = {
    health: () => this.generateKey('system', 'health'),
    version: () => this.generateKey('system', 'version'),
    maintenance: () => this.generateKey('system', 'maintenance'),
    config: (configKey: string) => this.generateKey('system', 'config', configKey)
  };

  /**
   * Generate pattern for bulk operations
   */
  public patterns = {
    allUsers: () => this.generateKey('user', '*'),
    allSkills: () => this.generateKey('skill', '*'),
    allAssessments: () => this.generateKey('assessment', '*'),
    userSessions: (userId: string) => this.generateKey('session', '*', userId, '*'),
    skillsByCategory: (category: string) =>
      this.generateKey('skills', 'category', this.sanitizeKey(category), '*'),
    expiredKeys: (timestamp: string) => this.generateKey('expired', timestamp, '*')
  };

  /**
   * TTL constants (in seconds)
   */
  public ttl = {
    SHORT: 5 * 60,        // 5 minutes
    MEDIUM: 30 * 60,      // 30 minutes
    LONG: 60 * 60,        // 1 hour
    VERY_LONG: 6 * 60 * 60, // 6 hours
    DAILY: 24 * 60 * 60,  // 24 hours
    WEEKLY: 7 * 24 * 60 * 60, // 7 days

    // Specific use cases
    SKILL_DATA: 60 * 60,          // 1 hour for skill data
    USER_SKILLS: 5 * 60,          // 5 minutes for user skills
    SEARCH_RESULTS: 10 * 60,      // 10 minutes for search results
    CATEGORIES: 2 * 60 * 60,      // 2 hours for categories
    ANALYTICS: 60 * 60,           // 1 hour for analytics
    SESSION_DATA: 30 * 60,        // 30 minutes for session data
    TEMP_DATA: 5 * 60             // 5 minutes for temporary data
  };

  /**
   * Sanitize key component to be Redis-safe
   */
  private sanitizeKey(key: string): string {
    return key
      .toLowerCase()
      .replace(/[^a-z0-9\-_]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  /**
   * Parse cache key to extract components
   */
  public parseKey(key: string): {
    app: string;
    namespace: string;
    identifier: string;
    subkey?: string;
  } | null {
    const parts = key.split(this.separator);
    if (parts.length < 3 || parts[0] !== this.appPrefix) {
      return null;
    }

    return {
      app: parts[0],
      namespace: parts[1],
      identifier: parts[2],
      subkey: parts.length > 3 ? parts.slice(3).join(this.separator) : undefined
    };
  }

  /**
   * Generate cache key with TTL information embedded
   */
  public generateKeyWithTTL(namespace: string, identifier: string, ttl: number, ...subkeys: string[]): string {
    const baseKey = this.generateKey(namespace, identifier, ...subkeys);
    const expiresAt = Date.now() + (ttl * 1000);
    return `${baseKey}:ttl:${expiresAt}`;
  }

  /**
   * Validate cache key format
   */
  public isValidKey(key: string): boolean {
    const parsed = this.parseKey(key);
    return parsed !== null;
  }

  /**
   * Get key namespace
   */
  public getNamespace(key: string): string | null {
    const parsed = this.parseKey(key);
    return parsed?.namespace || null;
  }

  /**
   * Generate bulk operation keys
   */
  public generateBulkKeys(namespace: string, identifiers: string[]): string[] {
    return identifiers.map(id => this.generateKey(namespace, id));
  }
}
