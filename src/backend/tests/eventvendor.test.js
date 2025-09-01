import request from 'supertest';
import app from '../server.js';

describe('Event Vendor API', () => {
  it('should return 400 for invalid event id', async () => {
    const res = await request(app).get('/api/vendors/event/invalidid');
    expect(res.statusCode).toBe(400);
  });
});
