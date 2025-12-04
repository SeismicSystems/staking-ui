import { eq } from "drizzle-orm";
import schema from "ponder:schema";
import type { Hex } from "viem";
import type { DepositorStats } from "@/indexer/types";
import { timestampToDate } from "@/indexer/utils/conversions";

const depositorCache = new Set<Hex>();

export async function ensureDepositor(
  db: any,
  address: Hex,
  timestamp: bigint,
): Promise<void> {
  if (depositorCache.has(address)) {
    return;
  }

  const existing = await db.sql
    .select({ address: schema.depositors.address })
    .from(schema.depositors)
    .where(eq(schema.depositors.address, address))
    .limit(1);

  if (existing.length && existing[0]) {
    depositorCache.add(address);
    return;
  }

  const timestampDate = timestampToDate(timestamp);
  await db
    .insert(schema.depositors)
    .values({
      address,
      total_deposits: 0n,
      total_amount: 0n,
      first_deposit_timestamp: timestampDate,
      last_deposit_timestamp: timestampDate,
      created_at: timestampDate,
      updated_at: timestampDate,
    })
    .onConflictDoNothing();

  depositorCache.add(address);
}

export async function getDepositorStats(
  db: any,
  address: Hex,
): Promise<DepositorStats | null> {
  const result = await db.sql
    .select({
      address: schema.depositors.address,
      total_deposits: schema.depositors.total_deposits,
      total_amount: schema.depositors.total_amount,
    })
    .from(schema.depositors)
    .where(eq(schema.depositors.address, address))
    .limit(1);

  return result.length && result[0] ? result[0] : null;
}

export function isFirstDeposit(stats: DepositorStats | null): boolean {
  return stats ? stats.total_deposits === 0n : true;
}

export async function updateDepositorStats(
  db: any,
  address: Hex,
  stats: DepositorStats,
  amount: bigint,
  timestamp: bigint,
): Promise<void> {
  await db.update(schema.depositors, { address }).set({
    total_deposits: stats.total_deposits + 1n,
    total_amount: stats.total_amount + amount,
    last_deposit_timestamp: timestampToDate(timestamp),
    updated_at: timestampToDate(timestamp),
  });
}
