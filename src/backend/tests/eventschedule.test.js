import request from 'supertest';
import app from '../server.js';

describe('Event Schedule API', () => {
  it('should return 400 for invalid event id', async () => {
    const res = await request(app).get('/api/schedules/event/invalidid');
    expect(res.statusCode).toBe(400);
  });
});
