import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { client, graphql } from "ponder";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

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
        const fromTimestamp = new Date(fromDate);
        conditions.push(gte(schema.deposits.block_timestamp, fromTimestamp));
      }
      if (toDate) {
        const toTimestamp = new Date(toDate);
        conditions.push(lte(schema.deposits.block_timestamp, toTimestamp));
      }
    }

    const depositorStats = await db
      .select()
      .from(schema.depositors)
      .where(eq(schema.depositors.address, address))
      .limit(1);

    const deposits = await db
      .select()
      .from(schema.deposits)
      .where(and(...conditions))
      .orderBy(desc(schema.deposits.block_timestamp))
      .limit(limit);

    const serializedDepositor = depositorStats[0]
      ? {
          ...depositorStats[0],
          total_deposits: depositorStats[0].total_deposits.toString(),
          total_amount: depositorStats[0].total_amount.toString(),
        }
      : null;

    const serializedDeposits = deposits.map((d) => ({
      ...d,
      amount: d.amount.toString(),
      deposit_index: d.deposit_index.toString(),
      block_number: d.block_number.toString(),
    }));

    return c.json({
      success: true,
      data: {
        depositor: serializedDepositor,
        deposits: serializedDeposits,
        count: deposits.length,
        filters: {
          from: fromDate,
          to: toDate,
          days: days,
          limit: limit,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching deposits:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch deposits",
      },
      500,
    );
  }
});

app.get("/stats", async (c) => {
  try {
    const stats = await db
      .select()
      .from(schema.deposit_stats)
      .where(eq(schema.deposit_stats.id, "global"))
      .limit(1);

    const data = stats[0];

    const serializedData = data
      ? {
          ...data,
          total_deposits: data.total_deposits.toString(),
          total_amount: data.total_amount.toString(),
          unique_depositors: data.unique_depositors.toString(),
        }
      : null;

    return c.json({
      success: true,
      data: serializedData,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch stats",
      },
      500,
    );
  }
});

export default app;
