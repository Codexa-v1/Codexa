// src/Testing/routes/schedule.test.js
import request from "supertest";
import express from "express";
import router from "../../backend/routes/EventSchedule.js"; // adjust path
import Event from "../../backend/models/event.js";
import EventSchedule from "../../backend/models/eventschedule.js";
import { vi, describe, it, expect, beforeEach } from "vitest";

const app = express();
app.use(express.json());
app.use("/", router);

// Mock Mongoose models
vi.mock("../../backend/models/event.js");
vi.mock("../../backend/models/eventschedule.js");

describe("Schedule Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========================
  // GET /event/:eventId
  // ========================
  it("should return all schedule items for an event", async () => {
    const eventId = "event123";
    const schedules = [
      { _id: "sched1", description: "Session 1" },
      { _id: "sched2", description: "Session 2" },
    ];

    EventSchedule.find.mockResolvedValue(schedules);

    const res = await request(app).get(`/event/${eventId}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(schedules);
    expect(EventSchedule.find).toHaveBeenCalledWith({ eventId });
  });

  it("should handle errors when fetching schedule items", async () => {
    EventSchedule.find.mockRejectedValue(new Error("DB Error"));

    const res = await request(app).get("/event/event123");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Failed to fetch events" });
  });

  // ========================
  // POST /event/:eventId
  // ========================
  it("should create a new schedule item", async () => {
    const eventId = "event123";
    const scheduleData = { description: "New Session", startTime: "10:00", endTime: "11:00" };

    Event.findById.mockResolvedValue({ _id: eventId });
    EventSchedule.prototype.save = vi.fn().mockResolvedValue({ _id: "sched123", ...scheduleData });

    const res = await request(app).post(`/event/${eventId}`).send(scheduleData);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(expect.objectContaining(scheduleData));
    expect(Event.findById).toHaveBeenCalledWith(eventId);
    expect(EventSchedule.prototype.save).toHaveBeenCalled();
  });

  it("should return 404 if event not found on POST", async () => {
    Event.findById.mockResolvedValue(null);

    const res = await request(app).post("/event/event123").send({ description: "X" });

    expect(res.status).toBe(404);
    expect(res.text).toBe("Event not found");
  });

  // ========================
  // PATCH /event/:eventId/schedule/:scheduleId
  // ========================
  it("should update a schedule item", async () => {
    const eventId = "event123";
    const scheduleId = "sched123";
    const updateFields = { description: "Updated Session" };

    const scheduleItem = { _id: scheduleId, eventId, description: "Old", save: vi.fn().mockResolvedValue({ _id: scheduleId, description: "Updated Session" }) };
    EventSchedule.findOne.mockResolvedValue(scheduleItem);

    const res = await request(app).patch(`/event/${eventId}/schedule/${scheduleId}`).send(updateFields);

    expect(res.status).toBe(200);
    expect(res.body.description).toBe("Updated Session");
    expect(EventSchedule.findOne).toHaveBeenCalledWith({ _id: scheduleId, eventId });
    expect(scheduleItem.save).toHaveBeenCalled();
  });

  it("should return 404 if schedule item not found on PATCH", async () => {
    EventSchedule.findOne.mockResolvedValue(null);

    const res = await request(app).patch("/event/event123/schedule/sched123").send({ description: "X" });

    expect(res.status).toBe(404);
    expect(res.text).toBe("Schedule item not found");
  });

  // ========================
  // DELETE /event/:eventId/schedule/:scheduleId
  // ========================
  it("should delete a schedule item", async () => {
    const eventId = "event123";
    const scheduleId = "sched123";

    const scheduleItem = { deleteOne: vi.fn().mockResolvedValue({}) };
    EventSchedule.findOne.mockResolvedValue(scheduleItem);

    const res = await request(app).delete(`/event/${eventId}/schedule/${scheduleId}`);

    expect(res.status).toBe(204);
    expect(EventSchedule.findOne).toHaveBeenCalledWith({ _id: scheduleId, eventId });
    expect(scheduleItem.deleteOne).toHaveBeenCalled();
  });

  it("should return 404 if schedule item not found on DELETE", async () => {
    EventSchedule.findOne.mockResolvedValue(null);

    const res = await request(app).delete("/event/event123/schedule/sched123");

    expect(res.status).toBe(404);
    expect(res.text).toBe("Schedule item not found");
  });

  it("should handle errors during delete", async () => {
    EventSchedule.findOne.mockRejectedValue(new Error("DB Error"));

    const res = await request(app).delete("/event/event123/schedule/sched123");

    expect(res.status).toBe(500);
    expect(res.text).toBe("Error deleting schedule item");
  });
});
