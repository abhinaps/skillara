#!/usr/bin/env ts-node

/**
 * Database verification script
 * Verifies all tables and data are properly set up
 */

import { db, testConnection } from '../src/infrastructure/database/connection';

async function verifyDatabase() {
  console.log('🔍 Verifying Skillara database setup...\n');

  try {
    // Test connection
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    // Check tables
    console.log('📋 Checking database tables...');
    const tableResult = await db.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    const expectedTables = [
      'analysis_sessions',
      'career_gaps',
      'extracted_content',
      'gap_details',
      'job_role_skills',
      'job_roles',
      'learning_objectives',
      'learning_resources',
      'market_positions',
      'profile_skills',
      'resource_skills',
      'resume_documents',
      'salary_benchmarks',
      'skill_demand',
      'skill_development_plans',
      'skill_extractions',
      'skill_profiles',
      'skills_taxonomy',
      'user_analytics'
    ];

    const actualTables = tableResult.rows.map(row => row.table_name).sort();

    console.log(`✅ Found ${actualTables.length} tables:`);
    actualTables.forEach(table => console.log(`   • ${table}`));

    // Check if all expected tables exist
    const missingTables = expectedTables.filter(table => !actualTables.includes(table));
    if (missingTables.length > 0) {
      console.log(`❌ Missing tables: ${missingTables.join(', ')}`);
      return false;
    }

    // Check skills taxonomy data
    console.log('\n🎯 Checking skills taxonomy data...');
    const skillsResult = await db.query('SELECT COUNT(*) as count FROM skills_taxonomy');
    const skillsCount = parseInt(skillsResult.rows[0].count);
    console.log(`✅ Found ${skillsCount} skills in taxonomy`);

    if (skillsCount === 0) {
      console.log('❌ No skills data found');
      return false;
    }

    // Show sample skills by category
    const categoriesResult = await db.query(`
      SELECT category, COUNT(*) as count
      FROM skills_taxonomy
      GROUP BY category
      ORDER BY count DESC
    `);

    console.log('\n📊 Skills by category:');
    categoriesResult.rows.forEach(row => {
      console.log(`   • ${row.category}: ${row.count} skills`);
    });

    // Check database indexes
    console.log('\n🔍 Checking database indexes...');
    const indexResult = await db.query(`
      SELECT indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND indexname NOT LIKE '%_pkey'
      ORDER BY indexname
    `);

    console.log(`✅ Found ${indexResult.rows.length} custom indexes:`);
    indexResult.rows.forEach(row => console.log(`   • ${row.indexname}`));

    console.log('\n🎉 Database verification completed successfully!');
    console.log('\n🚀 Your Skillara database is ready for development!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start the backend server: npm run dev');
    console.log('   2. Connect frontend to backend API');
    console.log('   3. Begin implementing skill extraction features');

    return true;

  } catch (error) {
    console.error('❌ Database verification failed:', error);
    return false;
  } finally {
    await db.end();
  }
}

// Run verification
verifyDatabase().then(success => {
  process.exit(success ? 0 : 1);
});
