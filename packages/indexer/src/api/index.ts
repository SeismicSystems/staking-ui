import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { client, graphql } from "ponder";
import { eq, desc } from "drizzle-orm";

const app = new Hono();

app.use("/sql/*", client({ db, schema }));

app.use("/", graphql({ db, schema }));
app.use("/graphql", graphql({ db, schema }));

// Get deposits for a specific user address
app.get("/deposits/:address", async (c) => {
  const address = c.req.param("address") as `0x${string}`;
  
  try {
    // Get depositor stats
    const depositorStats = await db
      .select()
      .from(schema.depositors)
      .where(eq(schema.depositors.address, address))
      .limit(1);

    // Get all deposits for this user
    const deposits = await db
      .select()
      .from(schema.deposits)
      .where(eq(schema.deposits.depositor, address))
      .orderBy(desc(schema.deposits.block_timestamp));

    return c.json({
      success: true,
      data: {
        depositor: depositorStats[0] || null,
        deposits: deposits,
        count: deposits.length,
      },
    });
  } catch (error) {
    console.error("Error fetching deposits:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch deposits",
      },
      500
    );
  }
});

// Get global deposit stats
app.get("/stats", async (c) => {
  try {
    const stats = await db
      .select()
      .from(schema.deposit_stats)
      .where(eq(schema.deposit_stats.id, 'global'))
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
      500
    );
  }
});

export default app;
