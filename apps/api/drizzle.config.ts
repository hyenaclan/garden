import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;

if (!DB_USER || !DB_PASS || !DB_HOST || !DB_NAME) {
  throw new Error('Missing one or more required database environment variables');
}

const url = `postgresql://${DB_USER}:${encodeURIComponent(DB_PASS)}@${DB_HOST}:5432/${DB_NAME}`;

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: url,
  },
});
