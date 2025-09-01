// backend/server.test.mjs
import request from 'supertest';
import app from './server.js';

describe('Backend API', () => {
  it('should respond to GET / with 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});
