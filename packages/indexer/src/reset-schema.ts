import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { Pool } from 'pg';
import { fileURLToPath } from 'url';
import { dropSchema } from './drop-schema.js';
import { createSchema } from './create-schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../../.env') });

async function resetSchema(schema: string, pool: Pool) {
  console.log('Resetting schema', schema);
  try {
    // Drop schema
    await dropSchema(schema, pool);
    
    // Create schema
    await createSchema(schema, pool);
    
    console.log(`\n✓ Schema ${schema} has been reset successfully`);
  } catch (error) {
    console.error('Error resetting schema:', error);
    throw error;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const pool = new Pool({
    connectionString: process.env.INDEXER_DATABASE_URL,
  });
  
  const schemaName = process.argv[2] || 'ponder_deposits';
  resetSchema(schemaName, pool)
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
    .finally(() => pool.end());
}

