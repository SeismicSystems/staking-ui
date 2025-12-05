import { eq } from "drizzle-orm";
import schema from "ponder:schema";
import type { GlobalStats, UpdateStats } from "@/indexer/types";
import { timestampToDate } from "@/indexer/utils/conversions";

export async function getGlobalStats(db: any): Promise<GlobalStats | null> {
  const result = await db.sql
    .select({
      id: schema.deposit_stats.id,
      total_deposits: schema.deposit_stats.total_deposits,
      total_deposit_amount: schema.deposit_stats.total_deposit_amount,
      total_withdrawals: schema.deposit_stats.total_withdrawals,
      total_withdrawal_amount: schema.deposit_stats.total_withdrawal_amount,
      net_amount: schema.deposit_stats.net_amount,
      unique_depositors: schema.deposit_stats.unique_depositors,
    })
    .from(schema.deposit_stats)
    .where(eq(schema.deposit_stats.id, "global"))
    .limit(1);

  return result.length && result[0] ? result[0] : null;
}

export async function updateGlobalStatsForDeposit(
  db: any,
  stats: GlobalStats,
  amount: bigint,
  timestamp: bigint,
  isNewDepositor: boolean,
): Promise<void> {
  const timestampDate = timestampToDate(timestamp);

  const updates: UpdateStats = {
    total_deposits: stats.total_deposits + 1n,
    total_deposit_amount: stats.total_deposit_amount + amount,
    net_amount: stats.net_amount + amount,
    unique_depositors: stats.unique_depositors + (isNewDepositor ? 1 : 0),
    last_updated: timestampDate,
    updated_at: timestampDate,
  };

  await db.update(schema.deposit_stats, { id: "global" }).set(updates);
}

export async function updateGlobalStatsForWithdrawal(
  db: any,
  stats: GlobalStats,
  amount: bigint,
  timestamp: Date,
): Promise<void> {
  const updates: UpdateStats = {
    total_withdrawals: stats.total_withdrawals + 1n,
    total_withdrawal_amount: stats.total_withdrawal_amount + amount,
    net_amount: stats.net_amount - amount,
    last_updated: timestamp,
    updated_at: timestamp,
  };

  await db.update(schema.deposit_stats, { id: "global" }).set(updates);
}

export async function initializeGlobalStats(
  db: any,
  amount: bigint,
  timestamp: bigint,
): Promise<void> {
  const timestampDate = timestampToDate(timestamp);

  await db
    .insert(schema.deposit_stats)
    .values({
      id: "global",
      total_deposits: 1n,
      total_deposit_amount: amount,
      total_withdrawals: 0n,
      total_withdrawal_amount: 0n,
      net_amount: amount,
      unique_depositors: 1,
      last_updated: timestampDate,
      created_at: timestampDate,
      updated_at: timestampDate,
    })
    .onConflictDoNothing();
}
