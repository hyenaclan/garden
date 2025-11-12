import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

export const handler = async () => {
  const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
  const connectionString = `postgresql://${DB_USER}:${encodeURIComponent(DB_PASS!)}@${DB_HOST}:5432/${DB_NAME}`;
  const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  const db = drizzle(pool);

  try {
    await pool.query(`GRANT CREATE ON DATABASE ${DB_NAME} TO ${DB_USER}`);
    await pool.query(`CREATE SCHEMA IF NOT EXISTS drizzle AUTHORIZATION ${DB_USER}`);

    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });

    let appliedMigrations = [];
    try {
      const { rows } = await pool.query(`
        SELECT id, hash, created_at
        FROM drizzle.__drizzle_migrations
        ORDER BY created_at DESC;
        `);
      appliedMigrations = rows;
    } catch {
      console.log('No drizzle.migrations table found — possibly first migration run');
    }

    console.log('Applied migrations:', appliedMigrations);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Migrations complete',
        appliedMigrations,
      }),
    };
  } catch (err) {
    console.error('Migration failed:', err);
    throw err;
  } finally {
    await pool.end();
  }
};
