import { testConnection } from '../src/infrastructure/database/connection';

async function main() {
  try {
    const result = await testConnection();
    if (!result) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Connection test failed:', error);
    process.exit(1);
  }
}

main();
