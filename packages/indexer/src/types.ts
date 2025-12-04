import type { Hex } from "viem";

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
