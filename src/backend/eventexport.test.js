import request from 'supertest';
import app from '../server.js';

describe('Event Export API', () => {
  it('should return 404 for export of non-existent event', async () => {
    const res = await request(app).get('/api/export/event/invalidid');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Event not found');
  });
});
