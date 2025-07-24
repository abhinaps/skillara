#!/usr/bin/env ts-node

/**
 * Database seed verification script
 */

import { db } from '../src/infrastructure/database/connection';

async function verifySeedData() {
  console.log('🔍 Verifying seed data...\n');

  try {
    // Check skills_taxonomy
    const skillsResult = await db.query('SELECT COUNT(*) as count, category FROM skills_taxonomy GROUP BY category ORDER BY category');
    console.log('📊 Skills Taxonomy:');
    skillsResult.rows.forEach(row => {
      console.log(`   ${row.category}: ${row.count} skills`);
    });

    const totalSkills = await db.query('SELECT COUNT(*) as total FROM skills_taxonomy');
    console.log(`   Total: ${totalSkills.rows[0].total} skills\n`);

    // Check job_roles
    const rolesResult = await db.query('SELECT COUNT(*) as count, job_family FROM job_roles GROUP BY job_family ORDER BY job_family');
    console.log('💼 Job Roles:');
    rolesResult.rows.forEach(row => {
      console.log(`   ${row.job_family}: ${row.count} roles`);
    });

    const totalRoles = await db.query('SELECT COUNT(*) as total FROM job_roles');
    console.log(`   Total: ${totalRoles.rows[0].total} job roles\n`);

    // Check job_role_skills mappings
    const mappingsResult = await db.query('SELECT COUNT(*) as total FROM job_role_skills');
    console.log(`🔗 Job Role Skills Mappings: ${mappingsResult.rows[0].total} total mappings\n`);

    // Check salary_benchmarks
    const salaryResult = await db.query('SELECT COUNT(*) as total FROM salary_benchmarks');
    console.log(`💰 Salary Benchmarks: ${salaryResult.rows[0].total} salary records\n`);

    // Sample data
    console.log('📋 Sample Job Roles:');
    const sampleRoles = await db.query(`
      SELECT job_title, experience_level, average_salary, demand_score, is_trending
      FROM job_roles
      ORDER BY demand_score DESC
      LIMIT 5
    `);

    sampleRoles.rows.forEach(role => {
      const trending = role.is_trending ? '📈' : '';
      console.log(`   ${role.job_title} (${role.experience_level}) - $${role.average_salary} - Score: ${role.demand_score} ${trending}`);
    });

    console.log('\n✅ Seed verification completed!');

  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  }
}

async function main() {
  try {
    await verifySeedData();
    process.exit(0);
  } catch (error) {
    console.error('❌ Verification script failed:', error);
    process.exit(1);
  }
}

main();
