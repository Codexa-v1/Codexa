// need to change mockGuest to match your guest structure in model

import { describe, it, expect, vi, beforeEach } from "vitest";
import { getGuests, addGuest, updateGuest, deleteGuest } from "../../backend/api/EventGuest"; // adjust path

// Mock fetch
global.fetch = vi.fn();

beforeEach(() => {
  fetch.mockReset();
});

describe("Guests API", () => {
  it("getGuests should return guests JSON", async () => {
    const mockGuests = [{
      id: "g1",
      name: "Alice",
      email: "alice@example.com",
      phone: "123-456-7890",
      eventId: "event123",
      rsvpStatus: "Accepted",
      dietaryPreferences: "Vegetarian",
      createdAt: "2025-09-01T10:00:00.000Z",
      updatedAt: "2025-09-10T10:00:00.000Z"
    }];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockGuests),
    });

    const result = await getGuests("event123");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/guests\/event\/event123$/)
    );
    expect(result).toEqual(mockGuests);
  });

  it("getGuests should return [] on 404", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 404 });

    const result = await getGuests("event404");
    expect(result).toEqual([]);
  });

  it("addGuest should POST and return created guest", async () => {
    const guest = {
      name: "Bob",
      email: "bob@example.com",
      phone: "987-654-3210",
      eventId: "event123",
      rsvpStatus: "Pending",
      dietaryPreferences: ""
    };
    const mockResponse = {
      id: "g2",
      ...guest,
      createdAt: "2025-09-01T10:00:00.000Z",
      updatedAt: "2025-09-10T10:00:00.000Z"
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await addGuest("event123", guest);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/guests\/event\/event123$/),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guest),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it("updateGuest should PUT and return updated guest", async () => {
    const guest = {
      name: "Charlie",
      email: "charlie@example.com",
      phone: "555-555-5555",
      eventId: "event123",
      rsvpStatus: "Declined",
      dietaryPreferences: "Gluten-Free"
    };
    const mockResponse = {
      id: "g3",
      ...guest,
      createdAt: "2025-09-01T10:00:00.000Z",
      updatedAt: "2025-09-10T10:00:00.000Z"
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await updateGuest("event123", "g3", guest);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/event\/event123\/guest\/g3$/),
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify(guest),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it("deleteGuest should DELETE and return success", async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    const result = await deleteGuest("event123", "g3");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/event\/event123\/guest\/g3$/),
      expect.objectContaining({ method: "DELETE" })
    );
    expect(result).toEqual({ success: true });
  });

  it("should throw on network error", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(addGuest("event123", {
      name: "Eve",
      email: "eve@example.com",
      phone: "111-222-3333",
      eventId: "event123",
      rsvpStatus: "Pending",
      dietaryPreferences: ""
    })).rejects.toThrow(
      "Network response was not ok"
    );
  });
});
