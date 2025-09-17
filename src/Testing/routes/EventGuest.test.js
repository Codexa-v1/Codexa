// src/Testing/routes/eventGuest.test.js
import request from 'supertest';
import express from 'express';
import router from '../../backend/routes/EventGuest.js'; // adjust path
import Event from '../../backend/models/event.js';
import Guest from '../../backend/models/guest.js';
import EventGuest from '../../backend/models/eventguest.js';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const app = express();
app.use(express.json());
app.use('/', router);

// Mock the Mongoose models
vi.mock('../../backend/models/event.js');
vi.mock('../../backend/models/guest.js');
vi.mock('../../backend/models/eventguest.js');

describe('EventGuest Router', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========================
  // GET /event/:eventId
  // ========================
  it('should return all guests for an event', async () => {
    const eventId = 'event123';
    const eventGuestDocs = [
      { guestId: 'guest1' },
      { guestId: 'guest2' },
    ];
    const guestDocs = [
      { _id: 'guest1', name: 'Alice' },
      { _id: 'guest2', name: 'Bob' },
    ];

    EventGuest.find.mockResolvedValue(eventGuestDocs);
    Guest.find.mockResolvedValue(guestDocs);

    const res = await request(app).get(`/event/${eventId}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(guestDocs);
    expect(EventGuest.find).toHaveBeenCalledWith({ eventId });
    expect(Guest.find).toHaveBeenCalledWith({ _id: { $in: ['guest1', 'guest2'] } });
  });

  it('should return 404 if no guests found', async () => {
    EventGuest.find.mockResolvedValue([]);
    const res = await request(app).get('/event/event123');
    expect(res.status).toBe(404);
    expect(res.text).toBe('No guests found for this event');
  });

  it('should handle errors', async () => {
    EventGuest.find.mockRejectedValue(new Error('DB Error'));
    const res = await request(app).get('/event/event123');
    expect(res.status).toBe(500);
    expect(res.text).toBe('Error retrieving guests');
  });

  // ========================
  // POST /event/:eventId
  // ========================
  it('should create a guest for an event', async () => {
    const eventId = 'event123';
    const guestData = { name: 'Alice', email: 'alice@example.com', phone: '123' };

    Event.findById.mockResolvedValue({ _id: eventId });
    Guest.prototype.save = vi.fn().mockResolvedValue({ _id: 'guest123', ...guestData });
    EventGuest.prototype.save = vi.fn().mockResolvedValue({});

    const res = await request(app).post(`/event/${eventId}`).send(guestData);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(expect.objectContaining({ name: 'Alice', email: 'alice@example.com' }));
    expect(Guest.prototype.save).toHaveBeenCalled();
    expect(EventGuest.prototype.save).toHaveBeenCalled();
  });

  it('should return 404 if event does not exist', async () => {
    Event.findById.mockResolvedValue(null);
    const res = await request(app).post('/event/event123').send({ name: 'Alice' });
    expect(res.status).toBe(404);
    expect(res.text).toBe('Event not found');
  });

  // ========================
  // PATCH /event/:eventId/guest/:guestId
  // ========================
  it('should update a guest', async () => {
    const eventId = 'event123';
    const guestId = 'guest123';
    const reqBody = { name: 'Alice Updated', rsvpStatus: 'accepted' };

    EventGuest.findOne.mockResolvedValue({ _id: 'eventGuest123', eventId, guestId });
    Guest.findByIdAndUpdate.mockResolvedValue({ _id: guestId, name: 'Alice Updated', rsvpStatus: 'accepted' });
    EventGuest.findByIdAndUpdate.mockResolvedValue({ rsvpStatus: 'accepted' });

    const res = await request(app).patch(`/event/${eventId}/guest/${guestId}`).send(reqBody);

    expect(res.status).toBe(200);
    expect(res.body.guest.name).toBe('Alice Updated');
    expect(res.body.eventGuest.rsvpStatus).toBe('accepted');
  });

  it('should return 404 if EventGuest not found', async () => {
    EventGuest.findOne.mockResolvedValue(null);
    const res = await request(app).patch('/event/event123/guest/guest123').send({ name: 'X' });
    expect(res.status).toBe(404);
    expect(res.text).toBe('Guest not found for this event');
  });

  // ========================
  // DELETE /event/:eventId/guest/:guestId
  // ========================
  it('should delete guest and eventGuest link', async () => {
    const eventId = 'event123';
    const guestId = 'guest123';

    EventGuest.findOne.mockResolvedValue({ _id: 'eventGuest123', eventId, guestId });
    EventGuest.deleteOne.mockResolvedValue({});
    EventGuest.exists.mockResolvedValue(false);
    Guest.findByIdAndDelete.mockResolvedValue({});

    const res = await request(app).delete(`/event/${eventId}/guest/${guestId}`);

    expect(res.status).toBe(204);
    expect(EventGuest.deleteOne).toHaveBeenCalledWith({ eventId, guestId });
    expect(Guest.findByIdAndDelete).toHaveBeenCalledWith(guestId);
  });

  it('should return 404 if EventGuest not found', async () => {
    EventGuest.findOne.mockResolvedValue(null);
    const res = await request(app).delete('/event/event123/guest/guest123');
    expect(res.status).toBe(404);
    expect(res.text).toBe('Guest not found for this event');
  });
});
