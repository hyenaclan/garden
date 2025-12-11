import { getDb, closeDb, getPool } from "./db.js";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import type { Pool } from "pg";

// Drizzle migration metadata row structure
export type MigrationRow = {
  id: number;
  hash: string;
  created_at: string | number;
};

// Safely query migrations table, even if first run
async function getAppliedMigrations(pool: Pool): Promise<MigrationRow[]> {
  try {
    const result = await pool.query<MigrationRow>(`
      SELECT id, hash, created_at
      FROM drizzle.__drizzle_migrations
      ORDER BY created_at ASC;
    `);
    return result.rows;
  } catch (err: unknown) {
    const migrate_table_missing =
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: string }).code === "42P01";
    if (migrate_table_missing) {
      return [];
    }
    throw err;
  }
}

export const handler = async () => {
  const { DB_USER, DB_NAME } = process.env;

  const db = getDb();
  const pool = getPool();

  try {
    await pool.query(`GRANT CREATE ON DATABASE ${DB_NAME} TO ${DB_USER}`);
    await pool.query(
      `CREATE SCHEMA IF NOT EXISTS drizzle AUTHORIZATION ${DB_USER}`,
    );

    // Before state
    const before = await getAppliedMigrations(pool);
    console.log("Previously applied migrations:", before);

    console.log("Running new migrations...");
    await migrate(db, { migrationsFolder: "./drizzle" });

    // After state
    const after = await getAppliedMigrations(pool);

    // Delta
    const beforeHashes = new Set(before.map((m) => m.hash));
    const delta = after.filter((m) => !beforeHashes.has(m.hash));

    console.log("Newly applied migrations:", delta);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Migrations complete",
        appliedBefore: before,
        appliedAfter: after,
        delta,
      }),
    };
  } catch (err) {
    console.error("Migration failed:", err);
    throw err;
  } finally {
    await closeDb();
  }
};

// Allow standalone CLI execution
if (typeof require !== "undefined" && require.main === module) {
  handler().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
