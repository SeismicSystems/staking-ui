import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { client, graphql } from "ponder";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

const app = new Hono();

app.use("/sql/*", client({ db, schema }));

app.use("/", graphql({ db, schema }));
app.use("/graphql", graphql({ db, schema }));

// Get deposits for a specific user address
app.get("/deposits/:address", async (c) => {
  const address = c.req.param("address") as `0x${string}`;
  
  // Query params for filtering
  const fromDate = c.req.query("from"); // ISO date string or timestamp
  const toDate = c.req.query("to"); // ISO date string or timestamp
  const days = c.req.query("days"); // e.g., "7", "30", "90"
  const limit = parseInt(c.req.query("limit") || "100");

  try {
    // Build where conditions
    const conditions = [eq(schema.deposits.depositor, address)];

    // Handle date filtering
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

    // Get depositor stats
    const depositorStats = await db
      .select()
      .from(schema.depositors)
      .where(eq(schema.depositors.address, address))
      .limit(1);

    // Get deposits with filters
    const deposits = await db
      .select()
      .from(schema.deposits)
      .where(and(...conditions))
      .orderBy(desc(schema.deposits.block_timestamp))
      .limit(limit);

    return c.json({
      success: true,
      data: {
        depositor: depositorStats[0] || null,
        deposits: deposits,
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

// Get global deposit stats
app.get("/stats", async (c) => {
  try {
    const stats = await db
      .select()
      .from(schema.deposit_stats)
      .where(eq(schema.deposit_stats.id, "global"))
      .limit(1);

    return c.json({
      success: true,
      data: stats[0] || null,
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
