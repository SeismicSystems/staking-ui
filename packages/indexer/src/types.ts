import type { Hex } from "viem";

export interface DepositorRecord {
  address: Hex;
  total_deposits: bigint;
  total_amount: bigint;
}

export interface DepositRecord {
  amount: bigint;
  deposit_index: bigint;
  block_number: bigint;
}

export interface GlobalStatsRecord {
  id: string;
  total_deposits: bigint;
  total_amount: bigint;
  unique_depositors: number;
  [key: string]: any;
}

export interface DepositorStats {
  address: Hex;
  total_deposits: bigint;
  total_amount: bigint;
}

export interface GlobalStats {
  id: string;
  total_deposits: bigint;
  total_amount: bigint;
  unique_depositors: number;
}

export interface UpdateStats {
  total_deposits: bigint;
  total_amount: bigint;
  unique_depositors: number;
  last_updated: Date;
  updated_at: Date;
}

// =============================================================================
// API Response Types (serialized for JSON transport - used by frontend)
// =============================================================================

/** Serialized user stats returned from GET /deposits/:address */
export interface UserStatsResponse {
  address: string;
  total_deposits: string;
  total_amount: string;
  first_deposit_timestamp: string;
  last_deposit_timestamp: string;
}

/** Serialized global stats returned from GET /stats */
export interface GlobalStatsResponse {
  total_deposits: string;
  total_amount: string;
  unique_depositors: string;
  last_updated: string;
}

/** Serialized deposit returned from GET /deposits/:address */
export interface DepositResponse {
  id: string;
  amount: string;
  block_timestamp: string;
  transaction_hash: string;
  deposit_index: string;
}
