import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getVendors,
  addVendor,
  updateVendor,
  deleteVendor,
} from "../../backend/api/EventVendor"; // adjust path

// Mock fetch globally
global.fetch = vi.fn();

beforeEach(() => {
  fetch.mockReset();
});

describe("Vendors API", () => {
  it("getVendors should return vendor list", async () => {
    const mockVendors = [{ id: "v1", name: "Venue Co." }];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockVendors),
    });

    const result = await getVendors("event123");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/vendors\/event\/event123$/)
    );
    expect(result).toEqual(mockVendors);
  });

  it("getVendors should return [] on 404", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 404 });

    const result = await getVendors("event404");

    expect(result).toEqual([]);
  });

  it("getVendors should throw on other errors", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(getVendors("badEvent")).rejects.toThrow(
      "Network response was not ok"
    );
  });

  it("addVendor should POST and return new vendor", async () => {
    const vendor = { name: "Catering Co." };
    const mockResponse = { id: "v2", ...vendor };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await addVendor("event123", vendor);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/vendors\/event\/event123$/),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendor),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it("updateVendor should PATCH and return updated vendor", async () => {
    const vendor = { name: "Updated Vendor" };
    const mockResponse = { id: "v3", ...vendor };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await updateVendor("event123", "v3", vendor);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/vendors\/event\/event123\/vendors\/v3$/),
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify(vendor),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it("deleteVendor should DELETE and resolve on success", async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    await expect(deleteVendor("event123", "v4")).resolves.not.toThrow();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/vendors\/event\/event123\/vendors\/v4$/),
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("deleteVendor should throw on failure", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(deleteVendor("event123", "v5")).rejects.toThrow(
      "Network response was not ok"
    );
  });
});
