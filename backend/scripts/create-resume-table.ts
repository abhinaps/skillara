#!/usr/bin/env ts-node

/**
 * Check database and create resume_documents table manually
 */

import { db } from '../src/infrastructure/database/connection';

async function main() {
  console.log('🔄 Checking database and creating resume_documents table...');

  try {
    // Check existing tables
    const existingTables = await db.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    console.log('📋 Existing tables:', existingTables.rows.map(row => row.table_name));

    // Create resume_documents table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS resume_documents (
          id UUID PRIMARY KEY,
          session_id UUID,
          original_name VARCHAR(255) NOT NULL,
          size_bytes INTEGER NOT NULL,
          mime_type VARCHAR(100) NOT NULL,
          file_hash VARCHAR(64) UNIQUE NOT NULL,
          storage_path VARCHAR(500) NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'uploaded',
          validation_errors JSONB DEFAULT '[]',
          uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          processed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await db.query(createTableSQL);
    console.log('✅ resume_documents table created successfully!');

    // Create indexes
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_resume_documents_session_id ON resume_documents(session_id);',
      'CREATE INDEX IF NOT EXISTS idx_resume_documents_file_hash ON resume_documents(file_hash);',
      'CREATE INDEX IF NOT EXISTS idx_resume_documents_status ON resume_documents(status);',
      'CREATE INDEX IF NOT EXISTS idx_resume_documents_uploaded_at ON resume_documents(uploaded_at);'
    ];

    for (const indexSQL of indexes) {
      await db.query(indexSQL);
    }

    console.log('✅ All indexes created successfully!');

    // Verify table structure
    const tableInfo = await db.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'resume_documents'
      ORDER BY ordinal_position
    `);

    console.log('📊 Table structure:');
    tableInfo.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await db.end();
  }
}

main();
