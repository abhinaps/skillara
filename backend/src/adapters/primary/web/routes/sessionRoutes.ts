import { Router, Request, Response } from 'express';

export interface CreateSessionRequest {
  sessionId?: string;
  sessionToken?: string;
  privacyConsent?: boolean;
  isPersistent?: boolean;
}

export function createSessionRoutes(): Router {
  const router = Router();

  // Create a new session
  router.post('/sessions', async (req: Request, res: Response) => {
    try {
      const { sessionId, sessionToken, privacyConsent = true, isPersistent = false }: CreateSessionRequest = req.body;

      // Generate UUID if not provided
      const { v4: uuidv4 } = require('uuid');
      const finalSessionId = sessionId || uuidv4();
      const finalSessionToken = sessionToken || `session-${Date.now()}`;
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Use the database connection directly for now
      const { getDatabaseConnection } = require('../../../../infrastructure/database/connection');
      const client = await getDatabaseConnection();

      // Insert session into database
      const query = `
        INSERT INTO analysis_sessions (
          id,
          session_token,
          session_status,
          privacy_consent,
          expires_at,
          is_persistent
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, session_token, created_at, expires_at
      `;

      const result = await client.query(query, [
        finalSessionId,
        finalSessionToken,
        'active',
        privacyConsent,
        expiresAt,
        isPersistent
      ]);

      const session = result.rows[0];

      res.status(201).json({
        success: true,
        session: {
          id: session.id,
          token: session.session_token,
          created_at: session.created_at,
          expires_at: session.expires_at
        }
      });

    } catch (error) {
      console.error('Session creation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create session',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get session info
  router.get('/sessions/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { getDatabaseConnection } = require('../../../../infrastructure/database/connection');
      const client = await getDatabaseConnection();

      const result = await client.query(
        'SELECT id, session_token, session_status, created_at, expires_at FROM analysis_sessions WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Session not found'
        });
      }

      const session = result.rows[0];
      res.json({
        success: true,
        session: {
          id: session.id,
          token: session.session_token,
          status: session.session_status,
          created_at: session.created_at,
          expires_at: session.expires_at
        }
      });

    } catch (error) {
      console.error('Get session error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get session',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return router;
}
