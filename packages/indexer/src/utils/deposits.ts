import { randomUUID } from "crypto";
import schema from "ponder:schema";
import type { Hex } from "viem";
import { timestampToDate } from "@/indexer/utils/conversions";

export async function createDeposit(
  db: any,
  event: any,
  amount: bigint,
  depositIndex: bigint,
  depositor: Hex,
): Promise<void> {
  const timestamp = timestampToDate(event.block.timestamp);

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
    block_timestamp: timestamp,
    transaction_hash: event.transaction.hash,
    depositor,
    created_at: timestamp,
  });
}
