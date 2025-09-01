import request from 'supertest';
import app from '../server.js';

describe('Event Vendor API', () => {
  it('should return 404 for vendors of non-existent event', async () => {
    const res = await request(app).get('/api/vendors/event/invalidid');
    expect(res.statusCode).toBe(404);
  });
});
