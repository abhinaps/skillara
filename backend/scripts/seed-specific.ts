#!/usr/bin/env ts-node

/**
 * Database specific seed script
 */

import { seedSpecific } from '../src/infrastructure/database/connection';

async function main() {
  const filename = process.argv[2];

  if (!filename) {
    console.error('❌ Please provide a seed filename as argument');
    console.log('Usage: npm run db:seed:specific -- 003_seed_job_roles.sql');
    process.exit(1);
  }

  console.log(`🌱 Running specific seed: ${filename}...`);

  try {
    await seedSpecific(filename);
    console.log(`✅ Specific seed completed: ${filename}!`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Specific seed failed for ${filename}:`, error);
    process.exit(1);
  }
}

main();
