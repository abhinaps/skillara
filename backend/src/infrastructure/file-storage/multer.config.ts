import multer from 'multer';
import { FileValidator } from './FileValidator';

// Configure multer for memory storage (we'll handle file storage ourselves)
export const uploadConfig = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only allow one file at a time
  },
  fileFilter: async (req, file, cb) => {
    try {
      // Basic MIME type check (more thorough validation happens later)
      const allowedMimeTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
      ];

      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
      }

      // Sanitize filename
      file.originalname = FileValidator.sanitizeFileName(file.originalname);

      cb(null, true);
    } catch (error) {
      cb(error as Error);
    }
  }
});

// Error handling middleware for multer
export const handleUploadError = (error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          error: 'File size too large. Maximum size is 5MB.'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          error: 'Too many files. Only one file is allowed.'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          error: 'Unexpected file field.'
        });
      default:
        return res.status(400).json({
          success: false,
          error: 'File upload error: ' + error.message
        });
    }
  }

  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }

  // Other errors
  return res.status(500).json({
    success: false,
    error: 'Internal server error during file upload'
  });
};
