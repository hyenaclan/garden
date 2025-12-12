import { getDb } from "../../src/db.js";
import "dotenv/config";
import { setupTestDb } from "./helpers.js";

let db: Awaited<ReturnType<typeof setupTestDb>>;

beforeAll(async () => {
  db = await setupTestDb();
});

afterAll(async () => {
  await db.teardown();
});

describe("Database migration integration tests", () => {
  test("creates expected tables in the public schema", async () => {
    const db = getDb();
    const result = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    const tableNames = result.rows.map((r) => r.table_name);
    expect(tableNames).toEqual(expect.arrayContaining(["gardeners"]));
  });

  test("records applied migrations in drizzle schema", async () => {
    const db = getDb();
    const migrations = await db.execute(`
      SELECT id, hash, created_at
      FROM drizzle.__drizzle_migrations
      ORDER BY created_at DESC;
    `);
    expect(migrations.rows.length).toBeGreaterThan(0);
    expect(migrations.rows[0]).toHaveProperty("hash");
  });

  test("verifies database is queryable after migrations", async () => {
    const db = getDb();
    const result = await db.execute(`
      SELECT COUNT(*)::int AS count FROM gardeners;
    `);
    const [{ count }] = result.rows;
    expect(typeof count).toBe("number");
  });
});
