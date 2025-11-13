import { GenericContainer } from 'testcontainers';
import { handler as runMigrations } from '../../src/migrate';
import { closeDb } from '../../src/db';

export async function setupTestDb() {
  if (process.env.CI) {
    process.env.DB_HOST = '127.0.0.1';
    process.env.DB_USER = 'postgres';
    process.env.DB_PASS = 'postgres';
    process.env.DB_NAME = 'garden';
    await runMigrations();
    return {
      teardown: async () => {
        await closeDb();
      },
    };
  }

  const container = await new GenericContainer('postgres:17')
    .withEnvironment({
      POSTGRES_USER: 'postgres',
      POSTGRES_PASSWORD: 'postgres',
      POSTGRES_DB: 'garden',
    })
    .withExposedPorts(5432)
    .start();

  const port = container.getMappedPort(5432);
  process.env.DB_HOST = 'localhost';
  process.env.DB_USER = 'postgres';
  process.env.DB_PASS = 'postgres';
  process.env.DB_NAME = 'garden';

  await runMigrations();

  return {
    teardown: async () => {
      await closeDb();
      await container.stop({ timeout: 2 });
    },
  };
}
