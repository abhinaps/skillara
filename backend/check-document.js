const { Client } = require('pg');
require('dotenv').config();

async function checkDocument() {
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

    // Get the most recent document
    const query = `
      SELECT
        id,
        session_id,
        original_filename,
        file_type,
        file_size_bytes,
        file_hash,
        storage_path,
        processing_status,
        uploaded_at
      FROM resume_documents
      ORDER BY uploaded_at DESC
      LIMIT 1
    `;

    const result = await client.query(query);

    if (result.rows.length > 0) {
      const doc = result.rows[0];
      console.log('✅ Most recent document found:');
      console.log('  ID:', doc.id);
      console.log('  Session ID:', doc.session_id);
      console.log('  Filename:', doc.original_filename);
      console.log('  Type:', doc.file_type);
      console.log('  Size:', doc.file_size_bytes, 'bytes');
      console.log('  Hash:', doc.file_hash);
      console.log('  Storage Path:', doc.storage_path);
      console.log('  Status:', doc.processing_status);
      console.log('  Uploaded:', doc.uploaded_at);
    } else {
      console.log('❌ No documents found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

checkDocument().catch(console.error);
