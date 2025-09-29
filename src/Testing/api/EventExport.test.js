// need to change mockEvent to match your event structure in model

import { describe, it, expect, vi, beforeEach } from "vitest";
import { getEvent } from "../../backend/api/EventExport"; // adjust path

global.fetch = vi.fn();
global.URL.createObjectURL = vi.fn(() => "blob:mockurl");
document.body.appendChild = vi.fn();
document.body.removeChild = vi.fn();

beforeEach(() => {
  fetch.mockReset();
  URL.createObjectURL.mockClear();
  document.body.appendChild.mockClear();
  document.body.removeChild.mockClear();
});

describe("getEvent with CSV download", () => {
  it("should fetch event, convert to CSV, and trigger download", async () => {
    const mockEvent = {
      id: "1",
      eventPlanner: "auth0|abc123",
      title: "Annual Gala",
      date: "2025-09-21T18:00:00.000Z",
      endDate: "2025-09-21T22:00:00.000Z",
      location: "Grand Ballroom",
      description: "A formal event for all members.",
      status: "Planned",
      budget: 5000,
      capacity: 200,
      category: "Corporate",
      organizer: {
        name: "Jane Doe",
        contact: "123-456-7890",
        email: "jane@example.com"
      },
      startTime: "18:00",
      endTime: "22:00",
      rsvpCurrent: 50,
      rsvpTotal: 200,
      createdAt: "2025-09-01T10:00:00.000Z",
      updatedAt: "2025-09-10T10:00:00.000Z"
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockEvent),
    });

    const result = await getEvent("1");

    // Verify fetch call
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/event\/1$/));

    // Verify CSV blob was created
    expect(URL.createObjectURL).toHaveBeenCalled();

    // Verify DOM download link was created + clicked
    expect(document.body.appendChild).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalled();

    // The function should return the original event
    expect(result).toEqual(mockEvent);
  });

  it("should throw on network error", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(getEvent("bad")).rejects.toThrow("Network response was not ok");
  });
});
