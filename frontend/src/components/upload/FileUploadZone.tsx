'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { validateFile, formatFileSize, getFileIcon } from './FileValidation';
import { UploadProgress } from './UploadProgress';
import { UploadedFile } from './upload.types';
import { fileUploadAPI } from '../../lib/api/fileUpload';

export const FileUploadZone: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const validation = validateFile(file);

      if (!validation.isValid) {
        // Add file with error status
        const fileWithError: UploadedFile = {
          file,
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'error',
          progress: 0,
          error: validation.error
        };

        setUploadedFiles(prev => [...prev, fileWithError]);
        return;
      }

      // Add valid file
      const validFile: UploadedFile = {
        file,
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'pending',
        progress: 0
      };

      setUploadedFiles(prev => [...prev, validFile]);

      // Start real upload
      uploadFile(validFile);
    });
  }, []);

  // Real file upload function
  const uploadFile = async (uploadedFile: UploadedFile) => {
    // Set status to uploading
    setUploadedFiles(prev =>
      prev.map(f => f.id === uploadedFile.id ? { ...f, status: 'uploading' as const } : f)
    );

    try {
      // Upload the file
      const result = await fileUploadAPI.uploadFile(uploadedFile.file);

      if (result.success && result.document) {
        // Update with success
        setUploadedFiles(prev =>
          prev.map(f => f.id === uploadedFile.id ? {
            ...f,
            status: 'completed' as const,
            progress: 100,
            documentId: result.document!.id,
            uploadedAt: result.document!.uploadedAt
          } : f)
        );
      } else {
        // Handle upload error
        setUploadedFiles(prev =>
          prev.map(f => f.id === uploadedFile.id ? {
            ...f,
            status: 'error' as const,
            error: result.error || 'Upload failed'
          } : f)
        );
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadedFiles(prev =>
        prev.map(f => f.id === uploadedFile.id ? {
          ...f,
          status: 'error' as const,
          error: error instanceof Error ? error.message : 'Upload failed'
        } : f)
      );
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }
        `}
      >
        <input {...getInputProps()} />

        {/* Upload Icon */}
        <div className="mb-4">
          <Upload className={`w-12 h-12 mx-auto ${isDragActive ? 'text-indigo-500' : 'text-gray-400'}`} />
        </div>

        {/* Upload Text */}
        <div className="mb-4">
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Drag and drop your resume, or <span className="text-indigo-600 font-medium">browse files</span>
          </p>
        </div>

        {/* Supported Formats */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Supports: PDF, DOCX, DOC • Max size: 5MB
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Uploaded Files
          </h3>

          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  {/* File Icon */}
                  <div className="text-2xl">
                    {getFileIcon(file.type)}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  disabled={file.status === 'uploading' || file.status === 'processing'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress */}
              <UploadProgress
                progress={file.progress}
                status={file.status}
                error={file.error}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
