import type { DepositorRecord, DepositRecord, GlobalStatsRecord } from "@/indexer/types";


  export function serializeBigInt(value: bigint): string {
    return value.toString();
  }
  
  export function serializeDepositor(depositor: DepositorRecord | undefined) {
    if (!depositor) return null;
  
    return {
      ...depositor,
      total_deposits: serializeBigInt(depositor.total_deposits),
      total_amount: serializeBigInt(depositor.total_amount),
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
      total_amount: serializeBigInt(stats.total_amount),
      unique_depositors: stats.unique_depositors.toString(),
    };
  }