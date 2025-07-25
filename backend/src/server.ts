import express from 'express';
import { testConnection } from './infrastructure/database/connection';
import { DIContainer } from './infrastructure/DIContainer';
import { createSkillRoutes } from './adapters/primary/web/routes/skillRoutes';
import { createUploadRoutes } from './adapters/primary/web/routes/uploadRoutes';
import { createSessionRoutes } from './adapters/primary/web/routes/sessionRoutes';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware (simple version)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

async function startServer() {
  try {
    // Test database connection
    console.log('🔄 Testing database connection...');
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Server not started.');
      process.exit(1);
    }

    // Initialize DI Container
    console.log('🔄 Initializing dependency injection container...');
    const container = DIContainer.getInstance();

    // Setup routes
    console.log('🔄 Setting up routes...');
    app.use('/api', createSkillRoutes(container.skillController));
    app.use('/api', createUploadRoutes(container.fileUploadController));
    app.use('/api', createSessionRoutes());

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    });

    // Root endpoint
    app.get('/', (req, res) => {
      res.json({
        message: 'Welcome to Skillara API',
        version: '1.0.0',
        endpoints: {
          health: '/health',
          skills: '/api/skills',
          assess: '/api/skills/assess',
          userSkills: '/api/users/{userId}/skills',
          upload: '/api/upload',
          documents: '/api/documents'
        }
      });
    });

    // Error handling middleware
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('❌ Unhandled error:', err);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      });
    });

    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    });

    // Start server
    app.listen(PORT, () => {
      console.log('🚀 Skillara API Server Started Successfully!');
      console.log(`📍 Server running on: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API endpoints: http://localhost:${PORT}/api`);
      console.log('✅ Ready to handle requests!');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
