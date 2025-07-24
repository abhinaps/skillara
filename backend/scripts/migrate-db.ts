#!/usr/bin/env ts-node

/**
 * Database migration script
 */

import { runMigrations } from '../src/infrastructure/database/connection';

async function main() {
  console.log('🔄 Running database migrations...');

  try {
    await runMigrations();
    console.log('✅ Migration script completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  }
}

main();
