import request from 'supertest';
import app from '../server.js';

describe('Event Venue API', () => {
  it('should return 404 for venues of non-existent event', async () => {
    const res = await request(app).get('/api/venues/event/invalidid');
    expect(res.statusCode).toBe(404);
  });
});
