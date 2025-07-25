#!/usr/bin/env ts-node

/**
 * Check the actual resume_documents table structure
 */

import { db } from '../src/infrastructure/database/connection';

async function main() {
  console.log('🔄 Checking resume_documents table structure...');

  try {
    // Check table structure
    const tableInfo = await db.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'resume_documents'
      ORDER BY ordinal_position
    `);

    console.log('📊 Current table structure:');
    tableInfo.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });

    // Check if we need to add missing columns
    const existingColumns = tableInfo.rows.map(row => row.column_name);
    const requiredColumns = [
      'id', 'session_id', 'original_name', 'size_bytes', 'mime_type',
      'file_hash', 'storage_path', 'status', 'validation_errors',
      'uploaded_at', 'processed_at', 'updated_at'
    ];

    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));

    if (missingColumns.length > 0) {
      console.log('⚠️ Missing columns:', missingColumns);

      // Add missing columns
      for (const column of missingColumns) {
        let sql = '';
        switch (column) {
          case 'status':
            sql = 'ALTER TABLE resume_documents ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT \'uploaded\';';
            break;
          case 'validation_errors':
            sql = 'ALTER TABLE resume_documents ADD COLUMN validation_errors JSONB DEFAULT \'[]\';';
            break;
          case 'processed_at':
            sql = 'ALTER TABLE resume_documents ADD COLUMN processed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;';
            break;
          case 'updated_at':
            sql = 'ALTER TABLE resume_documents ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;';
            break;
          default:
            console.log(`⚠️ Don't know how to add column: ${column}`);
            continue;
        }

        try {
          await db.query(sql);
          console.log(`✅ Added column: ${column}`);
        } catch (error) {
          console.error(`❌ Failed to add column ${column}:`, error);
        }
      }
    } else {
      console.log('✅ All required columns exist!');
    }

    // Final table structure check
    const finalTableInfo = await db.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'resume_documents'
      ORDER BY ordinal_position
    `);

    console.log('📊 Final table structure:');
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
