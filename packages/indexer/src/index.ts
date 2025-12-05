import dotenv from "dotenv";
import { dirname, join } from "path";
import { ponder } from "ponder:registry";
import { fileURLToPath } from "url";

import {
  extractDepositor,
  littleEndianToBigInt,
} from "@/indexer/utils/conversions";
import { createDeposit } from "@/indexer/utils/deposits";
import {
  ensureDepositor,
  ensureDepositorForWithdrawal,
  getDepositorStats,
  isFirstDeposit,
  updateDepositorStatsForDeposit,
  updateDepositorStatsForWithdrawal,
} from "@/indexer/utils/depositor";
import {
  getGlobalStats,
  initializeGlobalStats,
  updateGlobalStatsForDeposit,
  updateGlobalStatsForWithdrawal,
} from "@/indexer/utils/stats";
import * as schema from "ponder:schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../.env") });

ponder.on("DepositContract:DepositEvent", async ({ event, context }) => {
  const { db } = context;

  const amount = littleEndianToBigInt(event.args.amount);
  const depositIndex = littleEndianToBigInt(event.args.index);
  const depositor = extractDepositor(event.args.withdrawal_credentials);

  await ensureDepositor(db, depositor, event.block.timestamp);

  await createDeposit(db, event, amount, depositIndex, depositor);

  const depositorStats = await getDepositorStats(db, depositor);
  const isNew = isFirstDeposit(depositorStats);

  if (depositorStats) {
    await updateDepositorStatsForDeposit(
      db,
      depositor,
      depositorStats,
      amount,
      event.block.timestamp,
    );
  }

  const globalStats = await getGlobalStats(db);

  if (globalStats) {
    await updateGlobalStatsForDeposit(
      db,
      globalStats,
      amount,
      event.block.timestamp,
      isNew,
    );
  } else {
    await initializeGlobalStats(db, amount, event.block.timestamp);
  }
});

interface Withdrawal {
  index: bigint;
  validatorIndex: bigint;
  address: `0x${string}`;
  amount: bigint;
}

interface BlockWithWithdrawals {
  number: bigint;
  timestamp: bigint;
  withdrawals?: Withdrawal[];
}

ponder.on("WithdrawalTracker:block", async ({ event, context }) => {
  const { db, client } = context;

  const block = await client.getBlock({
    blockNumber: event.block.number,
    includeTransactions: false,
  });

  const withdrawals = block.withdrawals;

  if (!withdrawals || withdrawals.length === 0) return;

  const blockTimestamp = new Date(Number(block.timestamp) * 1000);

  for (const withdrawal of withdrawals) {
    const amount = BigInt(withdrawal.amount);
    const address = withdrawal.address;

    await db.insert(schema.withdrawals).values({
      id: `${block.number}-${withdrawal.index}`,
      validator_index: BigInt(withdrawal.validatorIndex),
      address,
      amount,
      block_number: block.number,
      block_timestamp: blockTimestamp,
      created_at: new Date(),
    });

    await ensureDepositorForWithdrawal(db, address, blockTimestamp);

    const depositorStats = await getDepositorStats(db, address);
    if (depositorStats) {
      await updateDepositorStatsForWithdrawal(
        db,
        address,
        depositorStats,
        amount,
        blockTimestamp,
      );
    }

    const globalStats = await getGlobalStats(db);
    if (globalStats) {
      await updateGlobalStatsForWithdrawal(
        db,
        globalStats,
        amount,
        blockTimestamp,
      );
    }
  }
});
