#!/usr/bin/env ts-node

/**
 * Add missing storage_path column to resume_documents table
 */

import { db } from '../src/infrastructure/database/connection';

async function main() {
  console.log('🔄 Adding missing storage_path column...');

  try {
    // Add storage_path column
    const addColumnSQL = `
      ALTER TABLE resume_documents
      ADD COLUMN IF NOT EXISTS storage_path VARCHAR(500) DEFAULT '';
    `;

    await db.query(addColumnSQL);
    console.log('✅ storage_path column added successfully!');

    // Verify the column was added
    const tableInfo = await db.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'resume_documents' AND column_name = 'storage_path'
    `);

    if (tableInfo.rows.length > 0) {
      console.log('📊 storage_path column details:', tableInfo.rows[0]);
    } else {
      console.log('⚠️ storage_path column not found after addition');
    }

    // Show final table structure
    const finalTableInfo = await db.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'resume_documents'
      ORDER BY ordinal_position
    `);

    console.log('📊 Updated table structure:');
    finalTableInfo.rows.forEach(row => {
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
