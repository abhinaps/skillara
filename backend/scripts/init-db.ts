#!/usr/bin/env ts-node

/**
 * Database initialization script
 * Run this to set up the database with initial schema and seed data
 */

import { initializeDatabase } from '../src/infrastructure/database/connection';

async function main() {
  console.log('🚀 Starting Skillara database initialization...');
  
  try {
    await initializeDatabase();
    console.log('✅ Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run the initialization
main();
