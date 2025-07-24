#!/usr/bin/env ts-node

/**
 * Clear specific database tables script
 */

import { db } from '../src/infrastructure/database/connection';

async function clearTables() {
  console.log('🧹 Clearing database tables for fresh seeding...');

  try {
    // Clear tables in reverse dependency order
    await db.query('TRUNCATE TABLE salary_benchmarks CASCADE;');
    console.log('✅ Cleared salary_benchmarks');

    await db.query('TRUNCATE TABLE skill_demand CASCADE;');
    console.log('✅ Cleared skill_demand');

    await db.query('TRUNCATE TABLE job_role_skills CASCADE;');
    console.log('✅ Cleared job_role_skills');

    await db.query('TRUNCATE TABLE job_roles CASCADE;');
    console.log('✅ Cleared job_roles');

    await db.query('TRUNCATE TABLE skills_taxonomy CASCADE;');
    console.log('✅ Cleared skills_taxonomy');

    console.log('🎉 All seed tables cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing tables:', error);
    throw error;
  }
}

async function main() {
  try {
    await clearTables();
    process.exit(0);
  } catch (error) {
    console.error('❌ Clear script failed:', error);
    process.exit(1);
  }
}

main();
