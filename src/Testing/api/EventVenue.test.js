// need to change mockVenue to match your venue structure in model

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the environment variable BEFORE importing the module
vi.stubGlobal('import', {
  meta: {
    env: {
      VITE_BACKEND_URL: 'http://localhost:3000'
    }
  }
});

import { getVenues, addVenue, updateVenue, deleteVenue } from '../../backend/api/EventVenue'; // Adjust import path

// Mock fetch globally
global.fetch = vi.fn();

describe('Venue API Functions', () => {
  const mockEventId = '123';
  const mockVenueId = '456';
  const mockVenue = {
    venueName: 'Grand Ballroom',
    venueAddress: '123 Main St',
    venueEmail: 'grandballroom@example.com',
    venuePhone: '123-456-7890',
    capacity: 200,
    venueStatus: 'Available',
    venueImage: 'https://example.com/image.jpg'
  };

  beforeEach(() => {
    fetch.mockClear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getVenues', () => {
    it('should fetch venues successfully', async () => {
      const mockVenues = [
        { id: '1', ...mockVenue },
        { id: '2', ...mockVenue, venueName: 'Conference Hall', capacity: 300 }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockVenues
      });

      const result = await getVenues(mockEventId);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/venues/event/123');
      expect(result).toEqual(mockVenues);
    });

    it('should throw error when response is not ok', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(getVenues(mockEventId)).rejects.toThrow('Network response was not ok');
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/venues/event/123');
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(getVenues(mockEventId)).rejects.toThrow('Network error');
    });
  });

  describe('addVenue', () => {
    it('should add venue successfully', async () => {
      const mockResponse = { id: 'new-venue-id', ...mockVenue };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await addVenue(mockEventId, mockVenue);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/venues/event/123', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockVenue)
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when add venue fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400
      });

      await expect(addVenue(mockEventId, mockVenue)).rejects.toThrow('Network response was not ok');
    });

    it('should handle invalid venue data', async () => {
      const invalidVenue = null;

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 422
      });

      await expect(addVenue(mockEventId, invalidVenue)).rejects.toThrow('Network response was not ok');
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/venues/event/123', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invalidVenue)
      });
    });
  });

  describe('updateVenue', () => {
    it('should update venue successfully', async () => {
      const updatedVenue = { ...mockVenue, venueName: 'Updated Venue Name' };
      const mockResponse = { id: mockVenueId, ...updatedVenue };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await updateVenue(mockEventId, mockVenueId, updatedVenue);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/venues/event/123/venue/456', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedVenue)
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when update venue fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(updateVenue(mockEventId, mockVenueId, mockVenue)).rejects.toThrow('Network response was not ok');
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { capacity: 300 };
      const mockResponse = { id: mockVenueId, ...mockVenue, ...partialUpdate };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await updateVenue(mockEventId, mockVenueId, partialUpdate);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/venues/event/123/venue/456', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(partialUpdate)
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteVenue', () => {
    it('should delete venue successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true
      });

      const result = await deleteVenue(mockEventId, mockVenueId);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/venues/event/123/venue/456', {
        method: 'DELETE'
      });
      expect(result).toBeUndefined();
    });

    it('should throw error when delete venue fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(deleteVenue(mockEventId, mockVenueId)).rejects.toThrow('Network response was not ok');
    });

    it('should handle server errors during deletion', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(deleteVenue(mockEventId, mockVenueId)).rejects.toThrow('Network response was not ok');
    });
  });

  describe('Error Handling', () => {
    it('should handle JSON parsing errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        }
      });

      await expect(getVenues(mockEventId)).rejects.toThrow('Invalid JSON');
    });

    it('should handle network timeout', async () => {
      fetch.mockRejectedValueOnce(new Error('Request timeout'));

      await expect(getVenues(mockEventId)).rejects.toThrow('Request timeout');
    });
  });

  describe('URL Construction', () => {
    it('should construct correct URLs for all endpoints', async () => {
      fetch.mockResolvedValue({ ok: true, json: async () => ({}) });

      // Test getVenues URL
      await getVenues(mockEventId);
      expect(fetch).toHaveBeenLastCalledWith('http://localhost:3000/api/venues/event/123');

      // Test addVenue URL
      await addVenue(mockEventId, mockVenue);
      expect(fetch).toHaveBeenLastCalledWith(
        'http://localhost:3000/api/venues/event/123',
        expect.any(Object)
      );

      // Test updateVenue URL
      await updateVenue(mockEventId, mockVenueId, mockVenue);
      expect(fetch).toHaveBeenLastCalledWith(
        'http://localhost:3000/api/venues/event/123/venue/456',
        expect.any(Object)
      );

      // Test deleteVenue URL
      fetch.mockResolvedValue({ ok: true });
      await deleteVenue(mockEventId, mockVenueId);
      expect(fetch).toHaveBeenLastCalledWith(
        'http://localhost:3000/api/venues/event/123/venue/456',
        expect.any(Object)
      );
    });
  });
});

// Integration-style tests (optional - for testing with a real server)
describe('Venue API Integration Tests', () => {
  // These would run against a test server
  it.skip('should perform full CRUD operations', async () => {
    // This test would be enabled when running against a real test server
    const eventId = 'test-event';
    
    // Create
    const newVenue = await addVenue(eventId, {
      venueName: 'Test Venue',
      venueAddress: 'Test Location',
      venueEmail: 'testvenue@example.com',
      venuePhone: '555-555-5555',
      capacity: 100,
      venueStatus: 'Available'
    });
    
    // Read
    const venues = await getVenues(eventId);
    expect(venues).toContainEqual(newVenue);
    
    // Update
    const updatedVenue = await updateVenue(eventId, newVenue.id, {
      venueName: 'Updated Test Venue'
    });
    expect(updatedVenue.venueName).toBe('Updated Test Venue');
    
    // Delete
    await deleteVenue(eventId, newVenue.id);
    
    // Verify deletion
    const finalVenues = await getVenues(eventId);
    expect(finalVenues.find(v => v.id === newVenue.id)).toBeUndefined();
  });
});