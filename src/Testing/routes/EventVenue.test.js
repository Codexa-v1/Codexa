// src/Testing/routes/venue.test.js
import request from "supertest";
import express from "express";
import router from "../../backend/routes/EventVenue.js"; // adjust path
import Event from "../../backend/models/event.js";
import Venue from "../../backend/models/venue.js";
import EventVenue from "../../backend/models/eventvenue.js";
import { vi, describe, it, expect, beforeEach } from "vitest";

const app = express();
app.use(express.json());
app.use("/", router);

// Mock Mongoose models
vi.mock("../../backend/models/event.js");
vi.mock("../../backend/models/venue.js");
vi.mock("../../backend/models/eventvenue.js");

describe("Venue Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========================
  // GET /event/:eventId
  // ========================
  it("should return all venues for an event", async () => {
    const eventId = "event123";
    const eventVenues = [{ venueId: "venue1" }, { venueId: "venue2" }];
    const venues = [{ _id: "venue1", venueName: "V1" }, { _id: "venue2", venueName: "V2" }];

    EventVenue.find.mockResolvedValue(eventVenues);
    Venue.find.mockResolvedValue(venues);

    const res = await request(app).get(`/event/${eventId}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(venues);
    expect(EventVenue.find).toHaveBeenCalledWith({ eventId });
    expect(Venue.find).toHaveBeenCalledWith({ _id: { $in: ["venue1", "venue2"] } });
  });

  it("should return 404 if no venues found", async () => {
    EventVenue.find.mockResolvedValue([]);

    const res = await request(app).get("/event/event123");

    expect(res.status).toBe(404);
    expect(res.text).toBe("No venues found for this event");
  });

  it("should handle errors when fetching venues", async () => {
    EventVenue.find.mockRejectedValue(new Error("DB Error"));

    const res = await request(app).get("/event/event123");

    expect(res.status).toBe(500);
    expect(res.text).toBe("Error retrieving venues");
  });

  // ========================
  // POST /event/:eventId
  // ========================
  it("should create a new venue for an event", async () => {
    const eventId = "event123";
    const venueData = { venueName: "Venue X", venueAddress: "123 Street" };

    Event.findById.mockResolvedValue({ _id: eventId });
    Venue.prototype.save = vi.fn().mockResolvedValue({ _id: "venue123", ...venueData });
    EventVenue.prototype.save = vi.fn().mockResolvedValue({ eventId, venueId: "venue123" });

    const res = await request(app).post(`/event/${eventId}`).send(venueData);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(expect.objectContaining(venueData));
    expect(Event.findById).toHaveBeenCalledWith(eventId);
    expect(Venue.prototype.save).toHaveBeenCalled();
    expect(EventVenue.prototype.save).toHaveBeenCalled();
  });

  it("should return 404 if event not found on POST", async () => {
    Event.findById.mockResolvedValue(null);

    const res = await request(app).post("/event/event123").send({ venueName: "X" });

    expect(res.status).toBe(404);
    expect(res.text).toBe("Event not found");
  });

  // ========================
  // PATCH /event/:eventId/venue/:venueId
  // ========================
  it("should update a venue", async () => {
    const eventId = "event123";
    const venueId = "venue123";
    const updateFields = { venueName: "Updated Venue" };

    EventVenue.findOne.mockResolvedValue({ eventId, venueId });
    Venue.findByIdAndUpdate.mockResolvedValue({ _id: venueId, ...updateFields });

    const res = await request(app).patch(`/event/${eventId}/venue/${venueId}`).send(updateFields);

    expect(res.status).toBe(200);
    expect(res.body.venue.venueName).toBe("Updated Venue");
    expect(EventVenue.findOne).toHaveBeenCalledWith({ eventId, venueId });
    expect(Venue.findByIdAndUpdate).toHaveBeenCalledWith(venueId, updateFields, { new: true, runValidators: true });
  });

  it("should return 404 if venue not found for PATCH", async () => {
    EventVenue.findOne.mockResolvedValue(null);

    const res = await request(app).patch("/event/event123/venue/venue123").send({ venueName: "X" });

    expect(res.status).toBe(404);
    expect(res.text).toBe("Venue not found for this event");
  });

  // ========================
  // DELETE /event/:eventId/venue/:venueId
  // ========================
  it("should delete a venue for an event", async () => {
    const eventId = "event123";
    const venueId = "venue123";

    EventVenue.findOne.mockResolvedValue({ eventId, venueId });
    EventVenue.deleteOne.mockResolvedValue({});
    EventVenue.exists.mockResolvedValue(false);
    Venue.findByIdAndDelete.mockResolvedValue({ _id: venueId });

    const res = await request(app).delete(`/event/${eventId}/venue/${venueId}`);

    expect(res.status).toBe(204);
    expect(EventVenue.findOne).toHaveBeenCalledWith({ eventId, venueId });
    expect(EventVenue.deleteOne).toHaveBeenCalledWith({ eventId, venueId });
    expect(EventVenue.exists).toHaveBeenCalledWith({ venueId });
    expect(Venue.findByIdAndDelete).toHaveBeenCalledWith(venueId);
  });

  it("should return 404 if venue not found on DELETE", async () => {
    EventVenue.findOne.mockResolvedValue(null);

    const res = await request(app).delete("/event/event123/venue/venue123");

    expect(res.status).toBe(404);
    expect(res.text).toBe("Venue not found for this event");
  });

  it("should handle errors during DELETE", async () => {
    EventVenue.findOne.mockRejectedValue(new Error("DB Error"));

    const res = await request(app).delete("/event/event123/venue/venue123");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Server error" });
  });
});
