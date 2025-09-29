// src/Testing/routes/eventDownload.test.js
import request from 'supertest';
import express from 'express';
import router from '../../backend/routes/EventExport.js'; // adjust path as needed
import Event from '../../backend/models/event.js';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const app = express();
app.use(express.json());
app.use('/', router);

vi.mock('../../backend/models/event.js');

describe('Event Download Router', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /event/:eventId - should return event when found', async () => {
    const mockEvent = {
      _id: '507f1f77bcf86cd799439012',
      eventPlanner: 'user123',
      title: 'Test Event',
      date: '2024-12-01T10:00:00.000Z',
      endDate: '2024-12-01T12:00:00.000Z',
      location: 'Test Location',
      description: 'Test Description',
      status: 'Planned',
      budget: 1000,
      capacity: 50,
      category: 'Corporate',
      organizer: {
        name: 'Jane Doe',
        contact: '123-456-7890',
        email: 'jane@example.com'
      },
      startTime: '10:00',
      endTime: '12:00',
      rsvpCurrent: 10,
      rsvpTotal: 50,
      createdAt: '2024-11-01T10:00:00.000Z',
      updatedAt: '2024-11-10T10:00:00.000Z'
    };
    Event.findById.mockResolvedValue(mockEvent);

    const res = await request(app).get('/event/507f1f77bcf86cd799439012');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockEvent);
    expect(Event.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439012');
  });

  it('GET /event/:eventId - should return 404 if event not found', async () => {
    Event.findById.mockResolvedValue(null);

    const res = await request(app).get('/event/507f1f77bcf86cd799439099');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Event not found' });
  });

  it('GET /event/:eventId - should handle server errors', async () => {
    Event.findById.mockRejectedValue(new Error('Database error'));

    const res = await request(app).get('/event/507f1f77bcf86cd799439099');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Server error' });
  });
});
