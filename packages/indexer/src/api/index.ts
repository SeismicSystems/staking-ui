import { and, desc, eq, gte, lte } from "drizzle-orm";
import { Hono } from "hono";
import { client, graphql } from "ponder";
import { db } from "ponder:api";
import schema from "ponder:schema";

import {
  serializeDeposit,
  serializeDepositor,
  serializeGlobalStats,
} from "@/indexer/utils/serializers";

const app = new Hono();

app.use("/sql/*", client({ db, schema }));
app.use("/", graphql({ db, schema }));
app.use("/graphql", graphql({ db, schema }));

app.get("/deposits/:address", async (c) => {
  const address = c.req.param("address") as `0x${string}`;
  const fromDate = c.req.query("from");
  const toDate = c.req.query("to");
  const days = c.req.query("days");
  const limit = parseInt(c.req.query("limit") || "100");

  try {
    const conditions = [eq(schema.deposits.depositor, address)];

    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(days));
      conditions.push(gte(schema.deposits.block_timestamp, daysAgo));
    } else {
      if (fromDate) {
        conditions.push(gte(schema.deposits.block_timestamp, new Date(fromDate)));
      }
      if (toDate) {
        conditions.push(lte(schema.deposits.block_timestamp, new Date(toDate)));
      }
    }

    const [depositorStats, deposits] = await Promise.all([
      db.select().from(schema.depositors).where(eq(schema.depositors.address, address)).limit(1),
      db.select().from(schema.deposits).where(and(...conditions)).orderBy(desc(schema.deposits.block_timestamp)).limit(limit),
    ]);

    return c.json({
      success: true,
      data: {
        depositor: serializeDepositor(depositorStats[0]),
        deposits: deposits.map(serializeDeposit),
        count: deposits.length,
        filters: { from: fromDate, to: toDate, days, limit },
      },
    });
  } catch (error) {
    console.error("Error fetching deposits:", error);
    return c.json({ success: false, error: "Failed to fetch deposits" }, 500);
  }
});

app.get("/stats", async (c) => {
  try {
    const stats = await db
      .select()
      .from(schema.deposit_stats)
      .where(eq(schema.deposit_stats.id, "global"))
      .limit(1);

    return c.json({
      success: true,
      data: serializeGlobalStats(stats[0]),
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return c.json({ success: false, error: "Failed to fetch stats" }, 500);
  }
});

export default app;