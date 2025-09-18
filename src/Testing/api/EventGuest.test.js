import { describe, it, expect, vi, beforeEach } from "vitest";
import { getGuests, addGuest, updateGuest, deleteGuest } from "../../backend/api/EventGuest"; // adjust path

// Mock fetch
global.fetch = vi.fn();

beforeEach(() => {
  fetch.mockReset();
});

describe("Guests API", () => {
  it("getGuests should return guests JSON", async () => {
    const mockGuests = [{ id: "g1", name: "Alice" }];

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
    const guest = { name: "Bob" };
    const mockResponse = { id: "g2", ...guest };

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
    const guest = { name: "Charlie" };
    const mockResponse = { id: "g3", ...guest };

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

    await expect(addGuest("event123", { name: "Eve" })).rejects.toThrow(
      "Network response was not ok"
    );
  });
});
