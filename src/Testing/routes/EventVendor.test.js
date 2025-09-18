// src/Testing/routes/vendor.test.js
import request from "supertest";
import express from "express";
import router from "../../backend/routes/EventVendor.js"; // adjust path
import Event from "../../backend/models/event.js";
import Vendor from "../../backend/models/vendor.js";
import EventVendor from "../../backend/models/eventvendor.js";
import { vi, describe, it, expect, beforeEach } from "vitest";

const app = express();
app.use(express.json());
app.use("/", router);

// Mock Mongoose models
vi.mock("../../backend/models/event.js");
vi.mock("../../backend/models/vendor.js");
vi.mock("../../backend/models/eventvendor.js");

describe("Vendor Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========================
  // GET /event/:eventId
  // ========================
  it("should return all vendors for an event", async () => {
    const eventId = "event123";
    const eventVendors = [
      { vendorId: "vendor1" },
      { vendorId: "vendor2" }
    ];
    const vendors = [
      { _id: "vendor1", name: "Vendor 1" },
      { _id: "vendor2", name: "Vendor 2" }
    ];

    EventVendor.find.mockResolvedValue(eventVendors);
    Vendor.find.mockResolvedValue(vendors);

    const res = await request(app).get(`/event/${eventId}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(vendors);
    expect(EventVendor.find).toHaveBeenCalledWith({ eventId });
    expect(Vendor.find).toHaveBeenCalledWith({ _id: { $in: ["vendor1", "vendor2"] } });
  });

  it("should return 404 if no vendors found", async () => {
    EventVendor.find.mockResolvedValue([]);

    const res = await request(app).get("/event/event123");

    expect(res.status).toBe(404);
    expect(res.text).toBe("No vendors found for this event");
  });

  it("should handle errors when fetching vendors", async () => {
    EventVendor.find.mockRejectedValue(new Error("DB Error"));

    const res = await request(app).get("/event/event123");

    expect(res.status).toBe(500);
    expect(res.text).toBe("Error retrieving vendors");
  });

  // ========================
  // POST /event/:eventId
  // ========================
  it("should create a new vendor for an event", async () => {
    const eventId = "event123";
    const vendorData = { name: "Vendor X", vendorType: "Catering" };

    Event.findById.mockResolvedValue({ _id: eventId });
    Vendor.prototype.save = vi.fn().mockResolvedValue({ _id: "vendor123", ...vendorData });
    EventVendor.prototype.save = vi.fn().mockResolvedValue({ eventId, vendorId: "vendor123" });

    const res = await request(app).post(`/event/${eventId}`).send(vendorData);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(expect.objectContaining(vendorData));
    expect(Event.findById).toHaveBeenCalledWith(eventId);
    expect(Vendor.prototype.save).toHaveBeenCalled();
    expect(EventVendor.prototype.save).toHaveBeenCalled();
  });

  it("should return 404 if event not found on POST", async () => {
    Event.findById.mockResolvedValue(null);

    const res = await request(app).post("/event/event123").send({ name: "X" });

    expect(res.status).toBe(404);
    expect(res.text).toBe("Event not found");
  });

  // ========================
  // PATCH /event/:eventId/vendors/:vendorId
  // ========================
  it("should update a vendor", async () => {
    const eventId = "event123";
    const vendorId = "vendor123";
    const updateFields = { name: "Updated Vendor" };

    EventVendor.findOne.mockResolvedValue({ eventId, vendorId });
    Vendor.findByIdAndUpdate.mockResolvedValue({ _id: vendorId, ...updateFields });

    const res = await request(app).patch(`/event/${eventId}/vendors/${vendorId}`).send(updateFields);

    expect(res.status).toBe(200);
    expect(res.body.vendor.name).toBe("Updated Vendor");
    expect(EventVendor.findOne).toHaveBeenCalledWith({ eventId, vendorId });
    expect(Vendor.findByIdAndUpdate).toHaveBeenCalledWith(vendorId, updateFields, { new: true, runValidators: true });
  });

  it("should return 404 if vendor not found for PATCH", async () => {
    EventVendor.findOne.mockResolvedValue(null);

    const res = await request(app).patch("/event/event123/vendors/vendor123").send({ name: "X" });

    expect(res.status).toBe(404);
    expect(res.text).toBe("Vendor not found for this event");
  });

  // ========================
  // DELETE /event/:eventId/vendors/:vendorId
  // ========================
  it("should delete a vendor for an event", async () => {
    const eventId = "event123";
    const vendorId = "vendor123";

    EventVendor.findOne.mockResolvedValue({ eventId, vendorId });
    EventVendor.deleteOne.mockResolvedValue({});
    EventVendor.exists.mockResolvedValue(false);
    Vendor.findByIdAndDelete.mockResolvedValue({ _id: vendorId });

    const res = await request(app).delete(`/event/${eventId}/vendors/${vendorId}`);

    expect(res.status).toBe(204);
    expect(EventVendor.findOne).toHaveBeenCalledWith({ eventId, vendorId });
    expect(EventVendor.deleteOne).toHaveBeenCalledWith({ eventId, vendorId });
    expect(EventVendor.exists).toHaveBeenCalledWith({ vendorId });
    expect(Vendor.findByIdAndDelete).toHaveBeenCalledWith(vendorId);
  });

  it("should return 404 if vendor not found on DELETE", async () => {
    EventVendor.findOne.mockResolvedValue(null);

    const res = await request(app).delete("/event/event123/vendors/vendor123");

    expect(res.status).toBe(404);
    expect(res.text).toBe("Vendor not found for this event");
  });

  it("should handle errors during DELETE", async () => {
    EventVendor.findOne.mockRejectedValue(new Error("DB Error"));

    const res = await request(app).delete("/event/event123/vendors/vendor123");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Server error" });
  });
});
