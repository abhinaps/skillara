#!/usr/bin/env ts-node

/**
 * Database seeding script - all seeds
 */

import { seedDatabase } from '../src/infrastructure/database/connection';

async function main() {
  console.log('🌱 Running all database seeds...');

  try {
    await seedDatabase();
    console.log('✅ All seeds completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding script failed:', error);
    process.exit(1);
  }
}

main();
