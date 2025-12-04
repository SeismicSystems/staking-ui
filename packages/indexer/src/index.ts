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
  getDepositorStats,
  isFirstDeposit,
  updateDepositorStats,
} from "@/indexer/utils/depositor";
import {
  getGlobalStats,
  initializeGlobalStats,
  updateGlobalStats,
} from "@/indexer/utils/stats";

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
    await updateDepositorStats(
      db,
      depositor,
      depositorStats,
      amount,
      event.block.timestamp,
    );
  }

  const globalStats = await getGlobalStats(db);

  if (globalStats) {
    await updateGlobalStats(
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
