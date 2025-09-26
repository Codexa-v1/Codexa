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
    const mockSchedule = [{ id: "s1", title: "Opening" }];

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
    const scheduleData = { title: "Session 1" };
    const mockResponse = { id: "s2", ...scheduleData };

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
    const updateData = { title: "Updated Session" };
    const mockResponse = { id: "s3", ...updateData };

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
