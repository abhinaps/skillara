import React from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface UploadProgressProps {
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  progress,
  status,
  error
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'uploading':
      case 'processing':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'uploading':
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Ready to upload';
      case 'uploading':
        return `Uploading... ${progress}%`;
      case 'processing':
        return 'Processing document...';
      case 'completed':
        return 'Upload completed successfully';
      case 'error':
        return error || 'Upload failed';
      default:
        return '';
    }
  };

  return (
    <div className="mt-4">
      {/* Progress Bar */}
      {(status === 'uploading' || status === 'processing') && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(progress, 10)}%` }}
          ></div>
        </div>
      )}

      {/* Status */}
      <div className={`flex items-center space-x-2 text-sm ${getStatusColor()}`}>
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>
    </div>
  );
};
