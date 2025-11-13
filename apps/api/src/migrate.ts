import { getDb, closeDb } from './db';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

export const handler = async () => {
  const { DB_USER, DB_NAME } = process.env;
  const db = getDb();

  try {
    const client = (db as any).session.client;
    await client.query(`GRANT CREATE ON DATABASE ${DB_NAME} TO ${DB_USER}`);
    await client.query(`CREATE SCHEMA IF NOT EXISTS drizzle AUTHORIZATION ${DB_USER}`);

    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });

    const { rows } = await client.query(`
      SELECT id, hash, created_at
      FROM drizzle.__drizzle_migrations
      ORDER BY created_at DESC;
    `);

    console.log('Applied migrations:', rows);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Migrations complete',
        appliedMigrations: rows,
      }),
    };
  } catch (err) {
    console.error('Migration failed:', err);
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
