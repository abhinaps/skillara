// AI Service Port Interface (DDD - Application Layer Port)
export interface IAIAnalysisService {
  extractSkills(text: string): Promise<SkillExtractionResult>;
  getProviderName(): string;
  isHealthy(): Promise<boolean>;
  getCapabilities(): AIProviderCapabilities;
  validateInput(text: string): Promise<ValidationResult>;
}

// AI Provider Configuration
export interface AIProviderConfig {
  apiKey: string;
  modelName?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
  retryAttempts?: number;
  providers?: Record<string, AIProviderConfig>;
}

// Provider Types
export type ProviderType =
  | 'gemini'
  | 'huggingface'
  | 'multi-provider'
  | 'openai'
  | 'anthropic';

// Provider Capabilities
export interface AIProviderCapabilities {
  supportsSkillExtraction: boolean;
  supportsConfidenceScoring: boolean;
  supportsContextCapture: boolean;
  supportsProficiencyEstimation: boolean;
  supportsFailover?: boolean;
  maxInputLength: number;
  averageProcessingTime: number;
  costPerRequest?: number;
  reliability?: number;
}

// Input Validation Result
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  estimatedProcessingTime: number;
}

// Skill Extraction Result
export interface SkillExtractionResult {
  skills: ExtractedSkill[];
  confidence: number;
  processingTime: number;
  provider: string;
  metadata: {
    textLength: number;
    modelUsed: string;
    timestamp: Date;
    multiProviderUsed?: boolean;
    attemptedProviders?: string[];
    successfulProvider?: string;
    fallbackMode?: boolean;
    allProvidersDown?: boolean;
    validationPassed?: boolean;
    costEstimate?: number;
    providersAttempted?: string[];
    failoverCount?: number;
  };
}

// Individual Extracted Skill
export interface ExtractedSkill {
  name: string;
  standardizedName: string;
  category: string;
  confidence: number;
  context: string[];
  proficiencyIndicators: string[];
  marketDemand?: number;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  lastMentioned?: Date;
}

// Confidence Scoring System
export interface ConfidenceScoring {
  calculateOverallConfidence(skills: ExtractedSkill[]): number;
  getConfidenceThreshold(): number;
  assessSkillConfidence(skillName: string, context: string[], textLength: number): number;
  validateConfidenceScore(score: number): boolean;
}

// Skill Standardization Service
export interface ISkillStandardizationService {
  standardizeSkillName(rawSkillName: string): string;
  categorizeSkill(skillName: string): string;
  findSynonyms(skillName: string): string[];
  isValidSkill(skillName: string): boolean;
  getSkillMetadata(skillName: string): SkillMetadata;
}

// Skill Metadata
export interface SkillMetadata {
  standardName: string;
  category: string;
  subcategory?: string;
  marketDemand: number;
  averageSalaryImpact: number;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  prerequisites: string[];
  relatedSkills: string[];
  certifications: string[];
}

// AI Analysis Context
export interface AIAnalysisContext {
  resumeType: 'technical' | 'managerial' | 'creative' | 'general';
  industryFocus?: string;
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive';
  targetRole?: string;
  customKeywords?: string[];
}

// Provider Performance Metrics
export interface ProviderMetrics {
  accuracy: number;
  averageProcessingTime: number;
  reliabilityScore: number;
  costEfficiency: number;
  lastHealthCheck: Date;
  totalRequestsProcessed: number;
  errorRate: number;
}

// AI Provider Configuration
export interface AIProviderConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
}
