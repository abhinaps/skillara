const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

async function createTestSession() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'skillara_db',
    user: process.env.DB_USER || 'skillara_user',
    password: process.env.DB_PASSWORD || 'skillara_password'
  });

  try {
    await client.connect();
    console.log('🔄 Connected to database');

    // Generate session data
    const sessionId = uuidv4();
    const sessionToken = `test-session-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Insert session
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
      sessionId,
      sessionToken,
      'active',
      true,
      expiresAt,
      true
    ]);

    const session = result.rows[0];
    console.log('✅ Test session created successfully:');
    console.log('  ID:', session.id);
    console.log('  Token:', session.session_token);
    console.log('  Created:', session.created_at);
    console.log('  Expires:', session.expires_at);
    console.log('📋 Use this session ID in your tests:', session.id);

    return session.id;

  } catch (error) {
    console.error('❌ Error creating test session:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// If running directly, create session
if (require.main === module) {
  createTestSession().catch(console.error);
}

module.exports = { createTestSession };
