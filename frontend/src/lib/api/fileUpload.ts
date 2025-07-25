const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Simple UUID v4 generator for browser
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export interface UploadResponse {
  success: boolean;
  message?: string;
  document?: {
    id: string;
    originalName: string;
    size: number;
    mimeType: string;
    status: string;
    uploadedAt: string;
    hash: string;
  };
  error?: string;
  details?: string[];
}

export interface SessionResponse {
  success: boolean;
  session?: {
    id: string;
    token: string;
    created_at: string;
    expires_at: string;
  };
  error?: string;
}

export interface DocumentResponse {
  success: boolean;
  document?: {
    id: string;
    originalName: string;
    size: number;
    mimeType: string;
    status: string;
    uploadedAt: string;
    canBeProcessed: boolean;
    isProcessed: boolean;
    validationErrors: string[];
  };
  error?: string;
}

export class FileUploadAPI {
  private sessionId: string | null = null;

  constructor() {
    // Initialize session on first use
    this.initializeSession();
  }

  private async initializeSession(): Promise<void> {
    if (typeof window === 'undefined') {
      this.sessionId = 'ssr-session';
      return;
    }

    // Check if we have a valid session stored
    const storedSessionId = localStorage.getItem('skillara-session-id');
    const storedExpiry = localStorage.getItem('skillara-session-expiry');

    if (storedSessionId && storedExpiry && new Date() < new Date(storedExpiry)) {
      this.sessionId = storedSessionId;
      return;
    }

    // Create a new session
    try {
      const sessionId = generateUUID();
      const sessionToken = `frontend-session-${Date.now()}`;

      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          sessionToken,
          privacyConsent: true,
          isPersistent: false
        }),
      });

      if (response.ok) {
        const result: SessionResponse = await response.json();
        if (result.success && result.session) {
          this.sessionId = result.session.id;
          localStorage.setItem('skillara-session-id', result.session.id);
          localStorage.setItem('skillara-session-expiry', result.session.expires_at);
        }
      } else {
        // Fallback: use UUID directly (assume backend will handle session creation)
        this.sessionId = sessionId;
        localStorage.setItem('skillara-session-id', sessionId);
      }
    } catch (error) {
      console.warn('Failed to create session, using fallback:', error);
      this.sessionId = generateUUID();
      localStorage.setItem('skillara-session-id', this.sessionId);
    }
  }

  private async getOrCreateSessionId(): Promise<string> {
    if (!this.sessionId) {
      await this.initializeSession();
    }
    return this.sessionId || generateUUID();
  }

  async uploadFile(
    file: File,
    onProgress?: (progressEvent: { loaded: number; total: number; progress: number }) => void
  ): Promise<UploadResponse> {
    const sessionId = await this.getOrCreateSessionId();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'X-Session-Id': sessionId,
        },
        body: formData,
      });

      const result: UploadResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  async getDocument(documentId: string): Promise<DocumentResponse> {
    const sessionId = await this.getOrCreateSessionId();

    try {
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
        headers: {
          'X-Session-Id': sessionId,
        },
      });

      const result: DocumentResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Get document error:', error);
      throw error;
    }
  }

  async deleteDocument(documentId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const sessionId = await this.getOrCreateSessionId();

    try {
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'X-Session-Id': sessionId,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Delete document error:', error);
      throw error;
    }
  }

  async getSessionId(): Promise<string> {
    return await this.getOrCreateSessionId();
  }
}

export const fileUploadAPI = new FileUploadAPI();
