// need to change mockSchedule to match your schedule structure in model

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getSchedule,
  createEventSchedule,
  updateEventSchedule,
  deleteEventSchedule,
} from "../../backend/api/EventSchedule"; // adjust path

// Mock fetch globally
global.fetch = vi.fn();

beforeEach(() => {
  fetch.mockReset();
});

describe("Schedule API", () => {
  it("getSchedule should return schedule JSON", async () => {
    const mockSchedule = [{
      id: "s1",
      eventId: "event123",
      description: "Opening Ceremony",
      startTime: "09:00",
      endTime: "09:30",
      createdAt: "2025-09-01T10:00:00.000Z",
      updatedAt: "2025-09-10T10:00:00.000Z"
    }];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSchedule),
    });

    const result = await getSchedule("event123");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/schedules\/event\/event123$/)
    );
    expect(result).toEqual(mockSchedule);
  });

  it("createEventSchedule should POST and return new schedule", async () => {
    const scheduleData = {
      eventId: "event123",
      description: "Session 1",
      startTime: "10:00",
      endTime: "11:00"
    };
    const mockResponse = {
      id: "s2",
      ...scheduleData,
      createdAt: "2025-09-01T10:00:00.000Z",
      updatedAt: "2025-09-10T10:00:00.000Z"
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await createEventSchedule("event123", scheduleData);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/schedules\/event\/event123$/),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleData),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it("updateEventSchedule should PATCH and return updated schedule", async () => {
    const updateData = {
      description: "Updated Session",
      startTime: "11:00",
      endTime: "12:00"
    };
    const mockResponse = {
      id: "s3",
      eventId: "event123",
      ...updateData,
      createdAt: "2025-09-01T10:00:00.000Z",
      updatedAt: "2025-09-10T10:00:00.000Z"
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await updateEventSchedule("event123", "s3", updateData);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/schedules\/event\/event123\/schedule\/s3$/),
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify(updateData),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it("deleteEventSchedule should DELETE and not throw on success", async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    await expect(deleteEventSchedule("event123", "s4")).resolves.not.toThrow();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/schedules\/event\/event123\/schedule\/s4$/),
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("deleteEventSchedule should throw on failure", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(deleteEventSchedule("event123", "s5")).rejects.toThrow(
      "Error deleting event schedule"
    );
  });
});
