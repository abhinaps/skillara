const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

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
  private sessionId: string;

  constructor() {
    // Generate a session ID for this browser session
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return 'ssr-session';

    let sessionId = localStorage.getItem('skillara-session-id');
    if (!sessionId) {
      sessionId = 'session-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
      localStorage.setItem('skillara-session-id', sessionId);
    }
    return sessionId;
  }

  async uploadFile(
    file: File,
    onProgress?: (progressEvent: { loaded: number; total: number; progress: number }) => void
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'X-Session-Id': this.sessionId,
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
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
        headers: {
          'X-Session-Id': this.sessionId,
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
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'X-Session-Id': this.sessionId,
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

  getSessionId(): string {
    return this.sessionId;
  }
}

export const fileUploadAPI = new FileUploadAPI();
