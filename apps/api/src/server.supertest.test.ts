import request from 'supertest';
import { init } from './server';
import { FastifyInstance } from 'fastify';

describe('Fastify Server with Supertest', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = init();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /health', () => {
    it('should return 200 OK with { ok: true }', async () => {
      const response = await request(app.server)
        .get('/health')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ ok: true });
    });
  });

  describe('GET /temp-api/health', () => {
    it('should return 200 OK and correct JSON structure', async () => {
      const response = await request(app.server)
        .get('/temp-api/health')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(typeof response.body.timestamp).toBe('string');
    });

    it('should return a valid ISO timestamp', async () => {
      const response = await request(app.server)
        .get('/temp-api/health')
        .expect(200);

      const date = new Date(response.body.timestamp);
      expect(date.toISOString()).toBe(response.body.timestamp);
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const response = await request(app.server)
        .get('/temp-api/health')
        .set('Origin', 'http://localhost:5173')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('404 handling', () => {
    it('should return 404 for non-existent routes', async () => {
      await request(app.server)
        .get('/nonexistent')
        .expect(404);
    });
  });
});