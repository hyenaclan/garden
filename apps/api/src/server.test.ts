import request from 'supertest';
// NOTE: We must import the app object directly, not call app.listen()
// We assume your express server instance is exported from server.ts.
// Since it's not currently exported, we will need to change server.ts next.
import app from './server'; 

describe('GET /api/hello', () => {
  it('should return a 200 OK status and a JSON body with the expected structure', async () => {
    // 1. Use Supertest to execute a request against the Express app instance
    const response = await request(app)
      .get('/api/hello')
      .expect('Content-Type', /json/) // Supertest assertion for header
      .expect(200); // Supertest assertion for status code

    // 2. Use Jest assertions to verify the response body data
    expect(response.body).toHaveProperty('message');
    expect(typeof response.body.message).toBe('string');
    
    expect(response.body).toHaveProperty('status');
    expect(response.body.status).toBe('ok');

    expect(response.body).toHaveProperty('timestamp');
    expect(typeof response.body.timestamp).toBe('string');
  });
});