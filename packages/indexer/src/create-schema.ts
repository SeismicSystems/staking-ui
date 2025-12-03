import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { Pool } from 'pg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../../.env') });

export async function createSchema(schema: string, pool: Pool) {
  console.log('Creating schema', schema);
  try {
    await pool.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`);
    console.log(`Successfully created ${schema} schema`);
  } catch (error) {
    console.error('Error creating schema:', error);
    throw error;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const pool = new Pool({
    connectionString: process.env.INDEXER_DATABASE_URL,
  });
  
  createSchema(process.argv[2] || 'ponder_deposits', pool)
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
    .finally(() => pool.end());
}

