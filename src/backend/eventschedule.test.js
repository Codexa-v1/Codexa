import request from 'supertest';
import app from '../server.js';

describe('Event Schedule API', () => {
  it('should return 200 and empty array for schedules of non-existent event', async () => {
    const res = await request(app).get('/api/schedules/event/invalidid');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
