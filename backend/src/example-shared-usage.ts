// Example of using shared types and utilities in backend
import { SessionId, ExperienceLevel, API_ENDPOINTS, BUSINESS_RULES } from '@skillara/shared';
import { formatDate, slugify } from '@skillara/shared/utils';

// Example Domain Service using shared value objects
export class SessionService {
  async createSession(): Promise<{ sessionId: string; expiresAt: string }> {
    // Generate a new session ID using shared value object
    const sessionId = SessionId.generate();

    // Use shared business rules
    const expirationHours = BUSINESS_RULES.DEFAULT_SESSION_DURATION_HOURS;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expirationHours);

    return {
      sessionId: sessionId.value,
      expiresAt: formatDate(expiresAt, 'ISO')
    };
  }

  async validateSession(sessionIdString: string): Promise<boolean> {
    try {
      // Validate session ID format using shared value object
      const sessionId = SessionId.fromString(sessionIdString);

      // TODO: Check database for session validity
      console.log(`Validating session: ${sessionId.value}`);

      return true;
    } catch (error) {
      return false;
    }
  }
}

// Example of using shared constants
export const getApiEndpoint = (operation: string): string => {
  switch (operation) {
    case 'career-analysis':
      return API_ENDPOINTS.CAREER_ANALYSIS;
    case 'document-upload':
      return API_ENDPOINTS.DOCUMENT_UPLOAD;
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
};

// Example of using shared types
export interface UserProfile {
  sessionId: string;
  experienceLevel: ExperienceLevel;
  skillCategories: string[];
  createdAt: string;
}

// Example utility usage
export const generateSkillSlug = (skillName: string): string => {
  return slugify(skillName);
};
