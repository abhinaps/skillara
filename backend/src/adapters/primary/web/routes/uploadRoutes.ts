import { Router, Request } from 'express';
import multer from 'multer';
import { FileUploadController, UploadRequest } from '../../FileUploadController';

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept PDF, DOC, DOCX files
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  }
});

// Session ID middleware - simple implementation for now
const sessionMiddleware = (req: UploadRequest, res: any, next: any) => {
  const sessionId = req.headers['x-session-id'] || req.query.sessionId || 'default-session';
  req.sessionId = sessionId as string;
  next();
};

export function createUploadRoutes(controller: FileUploadController): Router {
  const router = Router();

  // Apply session middleware to all routes
  router.use(sessionMiddleware);

  // Upload a file
  router.post('/upload', upload.single('file'), async (req, res) => {
    await controller.uploadFile(req, res);
  });

  // Get document by ID
  router.get('/documents/:id', async (req, res) => {
    await controller.getDocument(req, res);
  });

  // Delete document by ID
  router.delete('/documents/:id', async (req, res) => {
    await controller.deleteDocument(req, res);
  });

  // Get all documents for a session (optional endpoint)
  router.get('/documents', async (req: UploadRequest, res) => {
    try {
      const sessionId = req.sessionId || 'default-session';

      // This would need to be implemented in the repository
      res.json({
        success: true,
        message: 'Document listing endpoint - to be implemented',
        sessionId
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return router;
}
