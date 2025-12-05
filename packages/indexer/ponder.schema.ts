import { onchainTable, index } from "ponder";

export const depositors = onchainTable("depositors", (t) => ({
  address: t.hex().primaryKey(),
  total_deposits: t.bigint().notNull(),
  total_deposit_amount: t.bigint().notNull(),
  total_withdrawals: t.bigint().notNull(),
  total_withdrawal_amount: t.bigint().notNull(),
  net_amount: t.bigint().notNull(), // total_deposit_amount - total_withdrawal_amount
  first_deposit_timestamp: t.timestamp().notNull(),
  last_deposit_timestamp: t.timestamp().notNull(),
  last_withdrawal_timestamp: t.timestamp(),
  created_at: t.timestamp().notNull(),
  updated_at: t.timestamp().notNull(),
}));

export const deposits = onchainTable(
  "deposits",
  (t) => ({
    id: t.text().primaryKey(),
    node_pubkey: t.hex().notNull(),
    consensus_pubkey: t.hex().notNull(),
    withdrawal_credentials: t.hex().notNull(),
    amount: t.bigint().notNull(), // in gwei
    node_signature: t.hex().notNull(),
    consensus_signature: t.hex().notNull(),
    deposit_index: t.bigint().notNull(),

    block_number: t.bigint().notNull(),
    block_timestamp: t.timestamp().notNull(),
    transaction_hash: t.hex().notNull(),

    depositor: t.hex().notNull(), // extracted from withdrawal_credentials if 0x01 type

    created_at: t.timestamp().notNull(),
  }),
  (table) => ({
    withdrawal_credentials_idx: index().on(table.withdrawal_credentials),
    depositor_idx: index().on(table.depositor),
    block_timestamp_idx: index().on(table.block_timestamp),
    deposit_index_idx: index().on(table.deposit_index),
  }),
);

export const deposit_stats = onchainTable("deposit_stats", (t) => ({
  id: t.text().primaryKey(), // 'global'
  total_deposits: t.bigint().notNull(),
  total_deposit_amount: t.bigint().notNull(),
  total_withdrawals: t.bigint().notNull(),
  total_withdrawal_amount: t.bigint().notNull(),
  net_amount: t.bigint().notNull(), // total_deposit_amount - total_withdrawal_amount
  unique_depositors: t.integer().notNull(),
  last_updated: t.timestamp().notNull(),
  created_at: t.timestamp().notNull(),
  updated_at: t.timestamp().notNull(),
}));

export const withdrawals = onchainTable(
  "withdrawals",
  (t) => ({
    id: t.text().primaryKey(), // block_number + index
    validator_index: t.bigint().notNull(),
    address: t.hex().notNull(),
    amount: t.bigint().notNull(), // in gwei
    block_number: t.bigint().notNull(),
    block_timestamp: t.timestamp().notNull(),
    created_at: t.timestamp().notNull(),
  }),
  (table) => ({
    address_idx: index().on(table.address),
    block_timestamp_idx: index().on(table.block_timestamp),
    validator_index_idx: index().on(table.validator_index),
  }),
);
