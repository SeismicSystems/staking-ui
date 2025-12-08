import type {
  DepositorRecord,
  DepositRecord,
  GlobalStatsRecord,
} from "@/indexer/types";

export function serializeBigInt(value: bigint): string {
  return value.toString();
}

export function serializeDepositor(depositor: DepositorRecord | undefined) {
  if (!depositor) return null;

  return {
    ...depositor,
    total_deposits: serializeBigInt(depositor.total_deposits),
    total_deposit_amount: serializeBigInt(depositor.total_deposit_amount),
    total_withdrawals: serializeBigInt(depositor.total_withdrawals),
    total_withdrawal_amount: serializeBigInt(depositor.total_withdrawal_amount),
    net_amount: serializeBigInt(depositor.net_amount),
  };
}

export function serializeDeposit(deposit: DepositRecord) {
  return {
    ...deposit,
    amount: serializeBigInt(deposit.amount),
    deposit_index: serializeBigInt(deposit.deposit_index),
    block_number: serializeBigInt(deposit.block_number),
  };
}

export function serializeGlobalStats(stats: GlobalStatsRecord | undefined) {
  if (!stats) return null;

  return {
    ...stats,
    total_deposits: serializeBigInt(stats.total_deposits),
    total_deposit_amount: serializeBigInt(stats.total_deposit_amount),
    total_withdrawals: serializeBigInt(stats.total_withdrawals),
    total_withdrawal_amount: serializeBigInt(stats.total_withdrawal_amount),
    net_amount: serializeBigInt(stats.net_amount),
    unique_depositors: stats.unique_depositors.toString(),
  };
}
