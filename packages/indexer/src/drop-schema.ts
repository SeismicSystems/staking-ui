import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { Pool } from 'pg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../../.env') });

const pool = new Pool({
  connectionString: process.env.INDEXER_DATABASE_URL,
});

async function dropSchema(schema: string) {
  console.log('Dropping schema', schema);
  try {
    await pool.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);
    console.log(`Successfully dropped ${schema} schema`);
  } catch (error) {
    console.error('Error dropping schema:', error);
  } finally {
    await pool.end();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  dropSchema(process.argv[2] || 'ponder_deposits');
}

