import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import { dirname, join } from 'path';
import { ponder } from 'ponder:registry';
import schema from 'ponder:schema';
import { fileURLToPath } from 'url';
import { type Hex } from 'viem';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

// Cache for depositor records to avoid redundant DB lookups
const depositorCache = new Set<Hex>();

// Helper to extract depositor address from withdrawal_credentials
function extractDepositor(withdrawalCredentials: string): Hex {
  // withdrawal_credentials format for 0x01 type (most common):
  // 0x01 (1 byte) + 11 zero bytes + 20 byte address
  if (withdrawalCredentials.startsWith('0x01')) {
    return ('0x' + withdrawalCredentials.slice(-40)) as Hex;
  }
  // For other types, use the withdrawal_credentials itself as identifier
  return withdrawalCredentials as Hex;
}

// Helper to decode little endian bytes to bigint
function littleEndianToBigInt(bytes: string): bigint {
  // Remove 0x prefix
  const hex = bytes.startsWith('0x') ? bytes.slice(2) : bytes;
  
  // Reverse byte order (little endian to big endian)
  let reversed = '';
  for (let i = hex.length - 2; i >= 0; i -= 2) {
    reversed += hex.slice(i, i + 2);
  }
  
  return BigInt('0x' + reversed);
}

async function ensureDepositor(
  context: any,
  depositorAddress: Hex,
  timestamp: bigint
) {
  if (depositorCache.has(depositorAddress)) {
    return depositorAddress;
  }

  // Check if depositor already exists
  const existingDepositor = await context.db.sql
    .select({ address: schema.depositors.address })
    .from(schema.depositors)
    .where(eq(schema.depositors.address, depositorAddress))
    .limit(1);

  if (existingDepositor.length && existingDepositor[0]) {
    depositorCache.add(depositorAddress);
    return depositorAddress;
  }

  await context.db
    .insert(schema.depositors)
    .values({
      address: depositorAddress,
      total_deposits: 0n,
      total_amount: 0n,
      first_deposit_timestamp: new Date(Number(timestamp) * 1000),
      last_deposit_timestamp: new Date(Number(timestamp) * 1000),
      created_at: new Date(Number(timestamp) * 1000),
      updated_at: new Date(Number(timestamp) * 1000),
    })
    .onConflictDoNothing();

  depositorCache.add(depositorAddress);
  return depositorAddress;
}

ponder.on('DepositContract:DepositEvent', async ({ event, context }) => {
  const { db } = context;
  
  // Decode amount and index from little endian bytes
  const amount = littleEndianToBigInt(event.args.amount);
  const depositIndex = littleEndianToBigInt(event.args.index);
  
  // Extract depositor from withdrawal credentials
  const depositor = extractDepositor(event.args.withdrawal_credentials);
  
  // Ensure depositor record exists
  await ensureDepositor(context, depositor, event.block.timestamp);
  
  // Create deposit record
  await db.insert(schema.deposits).values({
    id: randomUUID(),
    node_pubkey: event.args.node_pubkey,
    consensus_pubkey: event.args.consensus_pubkey,
    withdrawal_credentials: event.args.withdrawal_credentials,
    amount,
    node_signature: event.args.node_signature,
    consensus_signature: event.args.consensus_signature,
    deposit_index: depositIndex,
    block_number: event.block.number,
    block_timestamp: new Date(Number(event.block.timestamp) * 1000),
    transaction_hash: event.transaction.hash,
    depositor,
    created_at: new Date(Number(event.block.timestamp) * 1000),
  });
  
  // Update depositor stats
  const depositorStats = await db.sql
    .select({
      address: schema.depositors.address,
      total_deposits: schema.depositors.total_deposits,
      total_amount: schema.depositors.total_amount,
    })
    .from(schema.depositors)
    .where(eq(schema.depositors.address, depositor))
    .limit(1);
  
  if (depositorStats.length && depositorStats[0]) {
    await db.update(schema.depositors, { address: depositor }).set({
      total_deposits: depositorStats[0].total_deposits + 1n,
      total_amount: depositorStats[0].total_amount + amount,
      last_deposit_timestamp: new Date(Number(event.block.timestamp) * 1000),
      updated_at: new Date(Number(event.block.timestamp) * 1000),
    });
  }
  
  // Update global stats
  const stats = await db.sql
    .select({
      id: schema.deposit_stats.id,
      total_deposits: schema.deposit_stats.total_deposits,
      total_amount: schema.deposit_stats.total_amount,
      unique_depositors: schema.deposit_stats.unique_depositors,
    })
    .from(schema.deposit_stats)
    .where(eq(schema.deposit_stats.id, 'global'))
    .limit(1);
  
  if (stats.length && stats[0]) {
    await db.update(schema.deposit_stats, { id: 'global' }).set({
      total_deposits: stats[0].total_deposits + 1n,
      total_amount: stats[0].total_amount + amount,
      last_updated: new Date(Number(event.block.timestamp) * 1000),
      updated_at: new Date(Number(event.block.timestamp) * 1000),
    });
  } else {
    // Initialize stats on first deposit
    await db
      .insert(schema.deposit_stats)
      .values({
        id: 'global',
        total_deposits: 1n,
        total_amount: amount,
        unique_depositors: 1,
        last_updated: new Date(Number(event.block.timestamp) * 1000),
        created_at: new Date(Number(event.block.timestamp) * 1000),
        updated_at: new Date(Number(event.block.timestamp) * 1000),
      })
      .onConflictDoNothing();
  }
  
  // Check if this is a new unique depositor
  const isNewDepositor = depositorStats.length && depositorStats[0]
    ? depositorStats[0].total_deposits === 0n
    : true;
  
  if (isNewDepositor) {
    const currentStats = await db.sql
      .select({ unique_depositors: schema.deposit_stats.unique_depositors })
      .from(schema.deposit_stats)
      .where(eq(schema.deposit_stats.id, 'global'))
      .limit(1);
    
    if (currentStats.length && currentStats[0]) {
      await db.update(schema.deposit_stats, { id: 'global' }).set({
        unique_depositors: currentStats[0].unique_depositors + 1,
      });
    }
  }
});