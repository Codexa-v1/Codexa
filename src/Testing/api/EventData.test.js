import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
} from "../../backend/api/EventData"; // adjust the path to your file

// Mock fetch globally
global.fetch = vi.fn();

beforeEach(() => {
  fetch.mockReset();
});

describe("Event API functions", () => {
  it("createEvent should POST data and return created event", async () => {
    const mockEvent = { id: "1", theme: "Test Event" };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockEvent),
    });

    const result = await createEvent({ theme: "Test Event" });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/events$/),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: "Test Event" }),
      })
    );

    expect(result).toEqual(mockEvent);
  });

  it("getEvent should GET an event", async () => {
    const mockEvent = { id: "123", theme: "Birthday" };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockEvent),
    });

    const result = await getEvent("123");

    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/events\/123$/));
    expect(result).toEqual(mockEvent);
  });

  it("updateEvent should PATCH data and return updated event", async () => {
    const mockUpdated = { id: "123", theme: "Updated Event" };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUpdated),
    });

    const result = await updateEvent("123", { theme: "Updated Event" });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/events\/123$/),
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ theme: "Updated Event" }),
      })
    );

    expect(result).toEqual(mockUpdated);
  });

  it("deleteEvent should DELETE an event", async () => {
    const mockResponse = { success: true };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await deleteEvent("123");

    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/events\/123$/), {
      method: "DELETE",
    });

    expect(result).toEqual(mockResponse);
  });

  it("getAllEvents should POST userId and return events list", async () => {
    const mockEvents = [{ id: "1" }, { id: "2" }];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockEvents),
    });

    const result = await getAllEvents("user123");

    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/events\/all$/), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "user123" }),
    });

    expect(result).toEqual(mockEvents);
  });

  it("should throw on network error", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(getEvent("999")).rejects.toThrow("Network response was not ok");
  });
});
