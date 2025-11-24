import { getDb, closeDb } from "./db";
import { migrate } from "drizzle-orm/node-postgres/migrator";

// Drizzle migration metadata row structure
export type MigrationRow = {
  id: number;
  hash: string;
  created_at: string | number;
};

// Safely query migrations table, even if first run
async function getAppliedMigrations(client: any): Promise<MigrationRow[]> {
  try {
    const result = await client.query(`
      SELECT id, hash, created_at
      FROM drizzle.__drizzle_migrations
      ORDER BY created_at ASC;
    `);
    return result.rows as MigrationRow[];
  } catch (err: any) {
    // Table doesn't exist → first-run
    if (err.code === "42P01") return [];
    throw err;
  }
}

export const handler = async () => {
  const { DB_USER, DB_NAME } = process.env;
  const db = getDb();
  const client = (db as any).session.client;

  try {
    // Ensure schema + permissions
    await client.query(`GRANT CREATE ON DATABASE ${DB_NAME} TO ${DB_USER}`);
    await client.query(
      `CREATE SCHEMA IF NOT EXISTS drizzle AUTHORIZATION ${DB_USER}`,
    );

    // Before state
    const before = await getAppliedMigrations(client);
    console.log("Previously applied migrations:", before);

    console.log("Running new migrations...");
    await migrate(db, { migrationsFolder: "./drizzle" });

    // After state
    const after = await getAppliedMigrations(client);

    // Delta
    const beforeHashes = new Set(before.map((m: MigrationRow) => m.hash));
    const delta = after.filter((m: MigrationRow) => !beforeHashes.has(m.hash));

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
if (require.main === module) {
  handler().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
