#!/usr/bin/env ts-node

/**
 * Run just the document processing migration
 */

import { db } from '../src/infrastructure/database/connection';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('🔄 Running document processing migration...');

  try {
    const migrationFile = path.join(__dirname, '../../database/migrations/002_document_processing_tables.sql');
    const sqlContent = fs.readFileSync(migrationFile, 'utf8');

    await db.query(sqlContent);

    console.log('✅ Document processing migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await db.end();
  }
}

main();
