import request from 'supertest';
import app from '../server.js';

describe('Event Guest API', () => {
  it('should return 404 for guests of non-existent event', async () => {
    const res = await request(app).get('/api/guests/event/invalidid');
    expect(res.statusCode).toBe(404);
  });
});
