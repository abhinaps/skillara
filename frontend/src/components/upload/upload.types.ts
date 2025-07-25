export interface UploadedFile {
  file: File;
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
  documentId?: string;
  uploadedAt?: string;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface UploadResponse {
  success: boolean;
  documentId?: string;
  message?: string;
  error?: string;
}
