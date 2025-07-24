#!/usr/bin/env ts-node

/**
 * Fresh seed script - clears and reseeds all data
 */

import { db } from '../src/infrastructure/database/connection';
import { seedSpecific } from '../src/infrastructure/database/connection';

async function clearTables() {
  console.log('🧹 Clearing database tables for fresh seeding...');

  // Clear tables in reverse dependency order
  await db.query('TRUNCATE TABLE salary_benchmarks CASCADE;');
  await db.query('TRUNCATE TABLE skill_demand CASCADE;');
  await db.query('TRUNCATE TABLE job_role_skills CASCADE;');
  await db.query('TRUNCATE TABLE job_roles CASCADE;');
  await db.query('TRUNCATE TABLE skills_taxonomy CASCADE;');

  console.log('✅ All seed tables cleared');
}

async function main() {
  try {
    console.log('🔄 Starting fresh seed process...');

    // Step 1: Clear existing data
    await clearTables();

    // Step 2: Seed skills first
    console.log('🌱 Step 1: Seeding skills taxonomy...');
    await seedSpecific('002_seed_skills_taxonomy.sql');

    // Step 3: Seed job roles
    console.log('🌱 Step 2: Seeding job roles...');
    await seedSpecific('003_seed_job_roles.sql');

    console.log('🎉 Fresh seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fresh seed script failed:', error);
    process.exit(1);
  }
}

main();
