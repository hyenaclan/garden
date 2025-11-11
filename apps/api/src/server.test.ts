import { init } from './server';
import { FastifyInstance } from 'fastify';

describe('Fastify Server', () => {
  let app: FastifyInstance;

  // Initialize the app before all tests
  beforeAll(async () => {
    app = init();
    await app.ready();
  });

  // Clean up after all tests
  afterAll(async () => {
    await app.close();
  });

  describe('GET /health', () => {
    it('should return 200 OK with { ok: true }', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health'
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ ok: true });
    });
  });

  describe('GET /temp-api/health', () => {
    it('should return 200 OK status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/temp-api/health'
      });

      expect(response.statusCode).toBe(200);
    });

    it('should return a JSON response with correct structure', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/temp-api/health'
      });

      const body = response.json();
      
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('timestamp');
    });

    it('should have status "ok"', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/temp-api/health'
      });

      const body = response.json();
      expect(body.status).toBe('ok');
    });

    it('should have a valid message', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/temp-api/health'
      });

      const body = response.json();
      expect(typeof body.message).toBe('string');
      expect(body.message).toBe('Hello from the Garden API');
    });

    it('should have a valid ISO timestamp', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/temp-api/health'
      });

      const body = response.json();
      expect(typeof body.timestamp).toBe('string');
      
      // Verify it's a valid ISO date string
      const date = new Date(body.timestamp);
      expect(date.toISOString()).toBe(body.timestamp);
    });

    it('should have CORS headers', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/temp-api/health',
        headers: {
          origin: 'http://localhost:5173'
        }
      });

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/nonexistent'
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('CORS preflight', () => {
    it('should handle OPTIONS requests', async () => {
      const response = await app.inject({
        method: 'OPTIONS',
        url: '/temp-api/health',
        headers: {
          origin: 'http://localhost:5173',
          'access-control-request-method': 'GET'
        }
      });

      expect(response.statusCode).toBe(204);
      expect(response.headers).toHaveProperty('access-control-allow-origin');
      expect(response.headers).toHaveProperty('access-control-allow-methods');
    });
  });
});