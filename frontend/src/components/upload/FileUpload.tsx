'use client';

import React from 'react';
import { FileUploadZone } from './FileUploadZone';

export const FileUpload: React.FC = () => {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Select Your Resume
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a PDF or Word document containing your resume. Our AI will extract and analyze your skills.
        </p>
      </div>

      <FileUploadZone />

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          After uploading, you&apos;ll be able to review the extracted skills and proceed with the analysis.
        </p>
      </div>
    </div>
  );
};
