import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Mock the Event model as a constructor + static methods
vi.mock('../../backend/models/event.js', () => {
  const mockFns = {
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
    find: vi.fn(),
  };

  function Event(data) {
    Object.assign(this, data);
    this.save = vi.fn();
  }

  return { default: Object.assign(Event, mockFns) };
});

// Import after mocking
import Event from '../../backend/models/event.js';
import eventRouter from '../../backend/routes/EventData.js';

// Create Express app for testing
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/events', eventRouter);
  return app;
};

describe('Event Router', () => {
  let app;
  let mockEvent;

  beforeEach(() => {
    app = createTestApp();

    // JSON-safe mock event matching the schema
    mockEvent = {
      _id: '507f1f77bcf86cd799439011',
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

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ------------------- GET /:id -------------------
  describe('GET /:id', () => {
    it('should return event when found', async () => {
      Event.findById.mockResolvedValue(mockEvent);

      const response = await request(app)
        .get('/events/507f1f77bcf86cd799439011')
        .expect(200);

      expect(Event.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(response.body).toEqual(mockEvent);
    });

    it('should return 404 when event not found', async () => {
      Event.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/events/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body).toEqual({ message: 'Event not found' });
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection failed');
      Event.findById.mockRejectedValue(dbError);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const response = await request(app)
        .get('/events/507f1f77bcf86cd799439011')
        .expect(500);

      expect(response.body).toEqual({ message: 'Server error' });
      expect(consoleSpy).toHaveBeenCalledWith(dbError);

      consoleSpy.mockRestore();
    });
  });

  // ------------------- PATCH /:id -------------------
  describe('PATCH /:id', () => {
    const updateData = {
      title: 'Updated Event',
      description: 'Updated Description'
    };

    it('should update event successfully', async () => {
      const updatedEvent = { ...mockEvent, ...updateData };
      Event.findByIdAndUpdate.mockResolvedValue(updatedEvent);

      const response = await request(app)
        .patch('/events/507f1f77bcf86cd799439011')
        .send(updateData)
        .expect(200);

      expect(Event.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateData,
        { new: true, runValidators: true }
      );
      expect(response.body).toEqual(updatedEvent);
    });

    it('should return 404 when event not found', async () => {
      Event.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .patch('/events/507f1f77bcf86cd799439011')
        .send(updateData)
        .expect(404);

      expect(response.body).toEqual({ message: 'Event not found' });
    });

    it('should handle validation errors', async () => {
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      Event.findByIdAndUpdate.mockRejectedValue(validationError);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const response = await request(app)
        .patch('/events/507f1f77bcf86cd799439011')
        .send(updateData)
        .expect(500);

      expect(response.body).toEqual({ message: 'Server error' });
      expect(consoleSpy).toHaveBeenCalledWith(validationError);

      consoleSpy.mockRestore();
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { title: 'Only Title Updated' };
      const updatedEvent = { ...mockEvent, ...partialUpdate };
      Event.findByIdAndUpdate.mockResolvedValue(updatedEvent);

      const response = await request(app)
        .patch('/events/507f1f77bcf86cd799439011')
        .send(partialUpdate)
        .expect(200);

      expect(response.body).toEqual(updatedEvent);
    });
  });

  // ------------------- POST / -------------------
  describe('POST /', () => {
    const newEventData = {
      eventPlanner: 'user123',
      title: 'New Event',
      date: '2024-12-01T10:00:00.000Z',
      endDate: '2024-12-01T12:00:00.000Z',
      location: 'New Location',
      description: 'New Description',
      status: 'Planned',
      budget: 500,
      capacity: 100,
      category: 'Corporate',
      organizer: {
        name: 'John Smith',
        contact: '555-555-5555',
        email: 'john@example.com'
      },
      startTime: '10:00',
      endTime: '12:00',
      rsvpCurrent: 0,
      rsvpTotal: 100
    };

    it('should create new event successfully', async () => {
      const savedEvent = { ...newEventData, _id: '507f1f77bcf86cd799439012', createdAt: '2024-11-01T10:00:00.000Z', updatedAt: '2024-11-01T10:00:00.000Z' };
      Event.prototype.save.mockResolvedValue(savedEvent);

      const response = await request(app)
        .post('/events')
        .send(newEventData)
        .expect(201);

      expect(Event.prototype.save).toHaveBeenCalled();
      expect(response.body).toEqual(savedEvent);
    });

    it('should handle validation errors during creation', async () => {
      const validationError = new Error('Validation failed: title is required');
      validationError.name = 'ValidationError';
      Event.prototype.save.mockRejectedValue(validationError);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const response = await request(app)
        .post('/events')
        .send({ description: 'Missing title' })
        .expect(500);

      expect(response.body).toEqual({ message: 'Server error' });
      expect(consoleSpy).toHaveBeenCalledWith(validationError);

      consoleSpy.mockRestore();
    });

    it('should handle empty request body', async () => {
      Event.prototype.save.mockResolvedValue({ _id: '507f1f77bcf86cd799439013', createdAt: '2024-11-01T10:00:00.000Z', updatedAt: '2024-11-01T10:00:00.000Z' });

      const response = await request(app)
        .post('/events')
        .send({})
        .expect(201);

      expect(Event.prototype.save).toHaveBeenCalled();
    });
  });

  // ------------------- DELETE /:id -------------------
  describe('DELETE /:id', () => {
    it('should delete event successfully', async () => {
      Event.findByIdAndDelete.mockResolvedValue(mockEvent);

      const response = await request(app)
        .delete('/events/507f1f77bcf86cd799439011')
        .expect(200);

      expect(response.body).toEqual({ message: 'Event deleted successfully' });
    });

    it('should return 404 when event not found', async () => {
      Event.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete('/events/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body).toEqual({ message: 'Event not found' });
    });

    it('should handle database errors during deletion', async () => {
      const dbError = new Error('Delete operation failed');
      Event.findByIdAndDelete.mockRejectedValue(dbError);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const response = await request(app)
        .delete('/events/507f1f77bcf86cd799439011')
        .expect(500);

      expect(response.body).toEqual({ message: 'Server error' });
      expect(consoleSpy).toHaveBeenCalledWith(dbError);

      consoleSpy.mockRestore();
    });
  });

  // ------------------- POST /all -------------------
  describe('POST /all', () => {
    const userId = 'user123';
    const userEvents = [
      mockEvent,
      {
        _id: '507f1f77bcf86cd799439012',
        eventPlanner: 'user123',
        title: 'Another Event',
        date: '2024-12-02T10:00:00.000Z',
        endDate: '2024-12-02T12:00:00.000Z',
        location: 'Another Location',
        description: 'Another Description',
        status: 'Planned',
        budget: 2000,
        capacity: 150,
        category: 'Corporate',
        organizer: {
          name: 'Alice Smith',
          contact: '222-333-4444',
          email: 'alice@example.com'
        },
        startTime: '10:00',
        endTime: '12:00',
        rsvpCurrent: 20,
        rsvpTotal: 150,
        createdAt: '2024-11-02T10:00:00.000Z',
        updatedAt: '2024-11-10T10:00:00.000Z'
      }
    ];

    it('should return all events for a user', async () => {
      Event.find.mockResolvedValue(userEvents);

      const response = await request(app)
        .post('/events/all')
        .send({ userId })
        .expect(200);

      expect(response.body).toEqual(userEvents);
    });

    it('should return 400 when userId is missing', async () => {
      const response = await request(app)
        .post('/events/all')
        .send({})
        .expect(400);

      expect(response.body).toEqual({ error: 'Missing userId in request body' });
    });

    it('should return empty array when user has no events', async () => {
      Event.find.mockResolvedValue([]);

      const response = await request(app)
        .post('/events/all')
        .send({ userId })
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should handle database errors when fetching user events', async () => {
      const dbError = new Error('Database query failed');
      Event.find.mockRejectedValue(dbError);

      const response = await request(app)
        .post('/events/all')
        .send({ userId })
        .expect(500);

      expect(response.body).toEqual({ error: 'Database query failed' });
    });
  });

  // ------------------- Edge Cases -------------------
  describe('Edge Cases', () => {
    it('should handle invalid ObjectId format', async () => {
      Event.findById.mockRejectedValue(new Error('Cast to ObjectId failed'));

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const response = await request(app)
        .get('/events/invalid-id')
        .expect(500);

      expect(response.body).toEqual({ message: 'Server error' });

      consoleSpy.mockRestore();
    });

    it('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .patch('/events/507f1f77bcf86cd799439011')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);
    });
  });
});
