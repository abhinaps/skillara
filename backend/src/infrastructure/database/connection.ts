import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'skillara_user',
  password: process.env.DB_PASSWORD || 'skillara_dev_password',
  database: process.env.DB_NAME || 'skillara_dev',
};

const pool = new Pool(dbConfig);

/**
 * Database connection instance
 */
export const db = pool;

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connected successfully at:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

/**
 * Run database migrations
 */
export async function runMigrations(): Promise<void> {
  try {
    console.log('🔄 Running database migrations...');

    const migrationsDir = path.join(__dirname, '../../../../database/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      console.log(`📄 Running migration: ${file}`);
      const sqlContent = fs.readFileSync(
        path.join(migrationsDir, file),
        'utf8'
      );

      await pool.query(sqlContent);
      console.log(`✅ Migration completed: ${file}`);
    }

    console.log('🎉 All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Seed database with initial data
 */
export async function seedDatabase(): Promise<void> {
  try {
    console.log('🌱 Seeding database...');

    const seedsDir = path.join(__dirname, '../../../../database/seeds');

    if (!fs.existsSync(seedsDir)) {
      console.log('ℹ️ No seeds directory found, skipping seeding');
      return;
    }

    const seedFiles = fs.readdirSync(seedsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of seedFiles) {
      console.log(`🌱 Running seed: ${file}`);
      const sqlContent = fs.readFileSync(
        path.join(seedsDir, file),
        'utf8'
      );

      await pool.query(sqlContent);
      console.log(`✅ Seed completed: ${file}`);
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

/**
 * Seed database with a specific seed file
 */
export async function seedSpecific(filename: string): Promise<void> {
  try {
    console.log(`🌱 Running specific seed: ${filename}...`);

    const seedsDir = path.join(__dirname, '../../../../database/seeds');
    const seedFilePath = path.join(seedsDir, filename);

    if (!fs.existsSync(seedFilePath)) {
      console.error(`❌ Seed file not found: ${filename}`);
      throw new Error(`Seed file not found: ${filename}`);
    }

    const sqlContent = fs.readFileSync(seedFilePath, 'utf8');
    await pool.query(sqlContent);

    console.log(`✅ Specific seed completed: ${filename}`);
  } catch (error) {
    console.error(`❌ Specific seed failed for ${filename}:`, error);
    throw error;
  }
}

/**
 * Initialize database (run migrations and seeds)
 */
export async function initializeDatabase(): Promise<void> {
  try {
    await testConnection();
    await runMigrations();
    await seedDatabase();
    console.log('🎉 Database initialization completed!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

/**
 * Close database connection
 */
export async function closeConnection(): Promise<void> {
  await pool.end();
  console.log('🔌 Database connection closed');
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeConnection();
  process.exit(0);
});
