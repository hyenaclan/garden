import { FastifyInstance } from 'fastify';
import { init } from '../../src/server';
import { setupTestDb } from './helpers';

let db: Awaited<ReturnType<typeof setupTestDb>>;
let app: FastifyInstance;

describe('API Integration Tests', () => {
  beforeAll(async () => {
    db = await setupTestDb();

    app = init();
    await app.ready();
  });

  afterAll(async () => {
    await db.teardown();
    await app.close();
  });

  test('responds within 100ms', async () => {
    const start = Date.now();
    await app.inject({ method: 'GET', url: '/health' });
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
  });

  test('handles multiple concurrent requests', async () => {
    const requests = Array(10)
      .fill(null)
      .map(() => app.inject({ method: 'GET', url: '/temp-api/health' }));
    const responses = await Promise.all(requests);
    responses.forEach((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.json()).toHaveProperty('status', 'ok');
    });
  });

  test('returns accurate timestamps', async () => {
    const before = new Date();
    const response = await app.inject({ method: 'GET', url: '/temp-api/health' });
    const after = new Date();
    const timestamp = new Date(response.json().timestamp);
    expect(timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  test('returns application/json content type', async () => {
    const response = await app.inject({ method: 'GET', url: '/temp-api/health' });
    expect(response.headers['content-type']).toContain('application/json');
  });

  test('only accepts GET requests on /health', async () => {
    const methods = ['POST', 'PUT', 'DELETE', 'PATCH'];
    for (const method of methods) {
      const response = await app.inject({ method: method as any, url: '/health' });
      expect(response.statusCode).toBe(404);
    }
  });

  test('handles malformed requests gracefully', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/temp-api/health',
      headers: { 'content-type': 'invalid/type' },
    });
    expect(response.statusCode).toBe(200);
  });

  test('returns consistent structure across multiple calls', async () => {
    const [r1, r2] = await Promise.all([
      app.inject({ method: 'GET', url: '/temp-api/health' }),
      app.inject({ method: 'GET', url: '/temp-api/health' }),
    ]);
    const b1 = r1.json();
    const b2 = r2.json();
    expect(Object.keys(b1).sort()).toEqual(Object.keys(b2).sort());
    expect(b1.message).toBe(b2.message);
    expect(b1.status).toBe(b2.status);
  });
});

