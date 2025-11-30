import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import "dotenv/config";

let cachedDb: ReturnType<typeof drizzle>;
let cachedPool: Pool;

export const getDb = (): NodePgDatabase<Record<string, unknown>> => {
  if (!cachedDb) {
    const { DB_USER, DB_PASS, DB_HOST, DB_NAME, DB_PORT } = process.env;

    if (!DB_USER || !DB_PASS || !DB_HOST || !DB_NAME || !DB_PORT) {
      throw new Error("Missing required database environment variables");
    }

    const isLocal = DB_HOST === "localhost" || process.env.CI === "true";

    const connectionString = `postgresql://${DB_USER}:${encodeURIComponent(DB_PASS!)}@${DB_HOST}:${DB_PORT}/${DB_NAME}?timezone=UTC`;
    cachedPool = new Pool({
      connectionString,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      max: 2,
    });
    cachedDb = drizzle(cachedPool);
  }
  return cachedDb;
};

export const getPool = (): Pool => {
  if (!cachedPool) {
    // ensure initialization happens
    getDb();
  }
  return cachedPool!;
};

export const closeDb = async () => {
  if (cachedPool) {
    await cachedPool.end();
  }
  cachedPool = null!;
  cachedDb = null!;
};
