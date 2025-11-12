import { init } from './server';
import { FastifyInstance } from 'fastify';

describe('Advanced API Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = init();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Response Time', () => {
    it('should respond within 100ms', async () => {
      const start = Date.now();
      
      await app.inject({
        method: 'GET',
        url: '/health'
      });
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Multiple Concurrent Requests', () => {
    it('should handle multiple concurrent requests', async () => {
      const requests = Array(10).fill(null).map(() => 
        app.inject({
          method: 'GET',
          url: '/temp-api/health'
        })
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.statusCode).toBe(200);
        expect(response.json()).toHaveProperty('status', 'ok');
      });
    });
  });

  describe('Timestamp Accuracy', () => {
    it('should return current timestamp', async () => {
      const before = new Date();
      
      const response = await app.inject({
        method: 'GET',
        url: '/temp-api/health'
      });
      
      const after = new Date();
      const timestamp = new Date(response.json().timestamp);

      expect(timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('Content Type', () => {
    it('should return application/json content type', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/temp-api/health'
      });

      expect(response.headers['content-type']).toContain('application/json');
    });
  });

  describe('HTTP Methods', () => {
    it('should only accept GET requests on /health', async () => {
      const methods = ['POST', 'PUT', 'DELETE', 'PATCH'];
      
      for (const method of methods) {
        const response = await app.inject({
          method: method as any,
          url: '/health'
        });
        
        expect(response.statusCode).toBe(404);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed requests gracefully', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/temp-api/health',
        headers: {
          'content-type': 'invalid/type'
        }
      });

      // Should still return successfully
      expect(response.statusCode).toBe(200);
    });
  });

  describe('Response Consistency', () => {
    it('should return consistent structure across multiple calls', async () => {
      const response1 = await app.inject({
        method: 'GET',
        url: '/temp-api/health'
      });

      const response2 = await app.inject({
        method: 'GET',
        url: '/temp-api/health'
      });

      const body1 = response1.json();
      const body2 = response2.json();

      expect(Object.keys(body1).sort()).toEqual(Object.keys(body2).sort());
      expect(body1.message).toBe(body2.message);
      expect(body1.status).toBe(body2.status);
    });
  });
});