#!/usr/bin/env ts-node

/**
 * Database connection test script
 */

import { testConnection } from '../src/infrastructure/database/connection';

async function main() {
  console.log('🔍 Testing database connection...');

  const isConnected = await testConnection();

  if (isConnected) {
    console.log('✅ Database connection test passed!');
    process.exit(0);
  } else {
    console.log('❌ Database connection test failed!');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Database test script failed:', error);
  process.exit(1);
});
