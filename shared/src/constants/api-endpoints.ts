// API Endpoint Constants
export const API_ENDPOINTS = {
  // Career Analysis
  CAREER_ANALYSIS: '/api/career-analysis',
  SKILL_GAP_ANALYSIS: '/api/career-analysis/skill-gaps',
  LEARNING_PATH: '/api/career-analysis/learning-path',
  MARKET_POSITION: '/api/career-analysis/market-position',

  // Document Processing
  DOCUMENT_PROCESSING: '/api/document-processing',
  DOCUMENT_UPLOAD: '/api/document-processing/upload',
  DOCUMENT_ANALYZE: '/api/document-processing/analyze',
  SKILL_EXTRACTION: '/api/document-processing/extract-skills',

  // Job Market
  JOB_MARKET: '/api/job-market',
  JOB_ROLES: '/api/job-market/roles',
  SALARY_BENCHMARKS: '/api/job-market/salary-benchmarks',
  SKILL_DEMAND: '/api/job-market/skill-demand',

  // Learning Recommendations
  LEARNING_RECOMMENDATIONS: '/api/learning-recommendations',
  LEARNING_RESOURCES: '/api/learning-recommendations/resources',
  SKILL_DEVELOPMENT_PLANS: '/api/learning-recommendations/development-plans',

  // Session Management
  SESSIONS: '/api/sessions',
  SESSION_CREATE: '/api/sessions/create',
  SESSION_VALIDATE: '/api/sessions/validate',
  SESSION_EXTEND: '/api/sessions/extend',

  // Analytics
  ANALYTICS: '/api/analytics',
  ANALYTICS_EVENTS: '/api/analytics/events',
  ANALYTICS_METRICS: '/api/analytics/metrics',

  // Health & Status
  HEALTH: '/health',
  STATUS: '/status',
  METRICS: '/metrics',
} as const;

// Error Codes
export const ERROR_CODES = {
  // General
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  RATE_LIMITED: 'RATE_LIMITED',

  // Session
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  SESSION_INVALID: 'SESSION_INVALID',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',

  // Document Processing
  DOCUMENT_TOO_LARGE: 'DOCUMENT_TOO_LARGE',
  DOCUMENT_INVALID_FORMAT: 'DOCUMENT_INVALID_FORMAT',
  DOCUMENT_PROCESSING_FAILED: 'DOCUMENT_PROCESSING_FAILED',
  DOCUMENT_CORRUPTED: 'DOCUMENT_CORRUPTED',

  // AI Services
  AI_SERVICE_UNAVAILABLE: 'AI_SERVICE_UNAVAILABLE',
  AI_RATE_LIMIT_EXCEEDED: 'AI_RATE_LIMIT_EXCEEDED',
  AI_PROCESSING_FAILED: 'AI_PROCESSING_FAILED',

  // Database
  DATABASE_CONNECTION_FAILED: 'DATABASE_CONNECTION_FAILED',
  DATABASE_QUERY_FAILED: 'DATABASE_QUERY_FAILED',
  DATABASE_CONSTRAINT_VIOLATION: 'DATABASE_CONSTRAINT_VIOLATION',

  // External Services
  EXTERNAL_SERVICE_UNAVAILABLE: 'EXTERNAL_SERVICE_UNAVAILABLE',
  EXTERNAL_SERVICE_TIMEOUT: 'EXTERNAL_SERVICE_TIMEOUT',
} as const;

// Business Rule Constants
export const BUSINESS_RULES = {
  // File Upload
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_FILE_TYPES: ['pdf', 'doc', 'docx', 'txt'] as const,

  // Session Management
  DEFAULT_SESSION_DURATION_HOURS: 24,
  MAX_SESSION_DURATION_HOURS: 168, // 7 days
  SESSION_CLEANUP_INTERVAL_HOURS: 6,

  // Skill Analysis
  MIN_CONFIDENCE_SCORE: 0.3,
  MAX_SKILLS_PER_PROFILE: 50,
  MIN_PROFICIENCY_LEVEL: 1,
  MAX_PROFICIENCY_LEVEL: 4,

  // Learning Recommendations
  MAX_LEARNING_OBJECTIVES: 10,
  MAX_RESOURCES_PER_SKILL: 5,
  MIN_LEARNING_DIFFICULTY: 1,
  MAX_LEARNING_DIFFICULTY: 5,

  // Rate Limiting
  API_RATE_LIMIT_PER_MINUTE: 60,
  UPLOAD_RATE_LIMIT_PER_MINUTE: 5,
  AI_REQUESTS_PER_HOUR: 100,

  // Data Retention
  ANONYMOUS_DATA_RETENTION_DAYS: 30,
  ERROR_LOG_RETENTION_DAYS: 90,
  ANALYTICS_DATA_RETENTION_DAYS: 365,
} as const;
