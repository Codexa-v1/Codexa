// need to change mockVendor to match your vendor structure in model

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
    const mockVendors = [{
      id: "v1",
      name: "Venue Co.",
      vendorType: "Venue",
      contactPerson: "John Smith",
      phone: "123-456-7890",
      email: "venue@example.com",
      website: "https://venueco.com",
      address: "123 Main St",
      rating: 5,
      notes: "Preferred partner",
      createdAt: "2025-09-01T10:00:00.000Z",
      updatedAt: "2025-09-10T10:00:00.000Z"
    }];

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
    const vendor = {
      name: "Catering Co.",
      vendorType: "Catering",
      contactPerson: "Jane Doe",
      phone: "987-654-3210",
      email: "catering@example.com",
      website: "https://cateringco.com",
      address: "456 Side St",
      rating: 4,
      notes: "Vegetarian options available"
    };
    const mockResponse = {
      id: "v2",
      ...vendor,
      createdAt: "2025-09-01T10:00:00.000Z",
      updatedAt: "2025-09-10T10:00:00.000Z"
    };

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
    const vendor = {
      name: "Updated Vendor",
      vendorType: "Decor",
      contactPerson: "Sam Lee",
      phone: "555-555-5555",
      email: "decor@example.com",
      website: "https://decorco.com",
      address: "789 Market St",
      rating: 3,
      notes: "Seasonal discounts"
    };
    const mockResponse = {
      id: "v3",
      ...vendor,
      createdAt: "2025-09-01T10:00:00.000Z",
      updatedAt: "2025-09-10T10:00:00.000Z"
    };

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
