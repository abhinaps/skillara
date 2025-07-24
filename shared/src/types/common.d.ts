export type ExperienceLevel = 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
export type SkillCategory = 'frontend' | 'backend' | 'database' | 'devops' | 'design' | 'project_management' | 'soft_skills' | 'language' | 'framework' | 'tool';
export type SessionStatus = 'uploading' | 'processing' | 'analyzing' | 'completed' | 'error' | 'expired';
export type ProficiencyLevel = 1 | 2 | 3 | 4;
export type FileFormat = 'pdf' | 'doc' | 'docx' | 'txt';
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type LearningPriority = 'high' | 'medium' | 'low';
export type ResourceType = 'course' | 'tutorial' | 'book' | 'video' | 'article' | 'practice' | 'certification' | 'bootcamp';
export type TrendDirection = 'rising' | 'stable' | 'declining';
export type RetentionPolicy = '7_days' | '30_days' | '90_days' | 'permanent';
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: Record<string, unknown>;
    };
    meta?: {
        timestamp: string;
        requestId: string;
        version: string;
    };
}
export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export interface DomainError {
    code: string;
    message: string;
    context?: Record<string, unknown>;
}
export interface ValidationError extends DomainError {
    field: string;
    value: unknown;
    constraint: string;
}
export interface DomainEvent {
    id: string;
    type: string;
    aggregateId: string;
    aggregateType: string;
    version: number;
    occurredAt: Date;
    data: Record<string, unknown>;
}
export interface IntegrationEvent {
    id: string;
    type: string;
    source: string;
    correlationId?: string;
    occurredAt: Date;
    data: Record<string, unknown>;
}
