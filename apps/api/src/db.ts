import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import 'dotenv/config';

let cachedDb: ReturnType<typeof drizzle>;
let cachedPool: Pool;

export const getDb = () => {
  if (!cachedDb) {
    const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
    const isLocal =
      DB_HOST === 'localhost' ||
      process.env.CI === 'true';

    const connectionString = `postgresql://${DB_USER}:${encodeURIComponent(DB_PASS!)}@${DB_HOST}:5432/${DB_NAME}`;
    cachedPool = new Pool({ 
        connectionString, 
        ssl: isLocal ? false : { rejectUnauthorized: false },
        max: 2,
      });
    cachedDb = drizzle(cachedPool);
  }
  return cachedDb;
};

export const closeDb = async () => {
  if (cachedPool) {
    await cachedPool.end();
    cachedPool = undefined as any;
  }

  cachedDb = undefined as any;
};