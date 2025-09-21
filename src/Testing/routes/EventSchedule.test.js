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
    const eventId = "507f1f77bcf86cd799439011";
    const schedules = [
      {
        _id: "sched1",
        eventId,
        description: "Session 1",
        startTime: "09:00",
        endTime: "09:30",
        createdAt: "2025-09-01T10:00:00.000Z",
        updatedAt: "2025-09-10T10:00:00.000Z"
      },
      {
        _id: "sched2",
        eventId,
        description: "Session 2",
        startTime: "09:30",
        endTime: "10:00",
        createdAt: "2025-09-01T10:00:00.000Z",
        updatedAt: "2025-09-10T10:00:00.000Z"
      }
    ];

    EventSchedule.find.mockResolvedValue(schedules);

    const res = await request(app).get(`/event/${eventId}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(schedules);
    expect(EventSchedule.find).toHaveBeenCalledWith({ eventId });
  });

  it("should handle errors when fetching schedule items", async () => {
    EventSchedule.find.mockRejectedValue(new Error("DB Error"));

    const res = await request(app).get("/event/507f1f77bcf86cd799439011");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Failed to fetch events" });
  });

  // ========================
  // POST /event/:eventId
  // ========================
  it("should create a new schedule item", async () => {
    const eventId = "507f1f77bcf86cd799439011";
    const scheduleData = {
      description: "New Session",
      startTime: "10:00",
      endTime: "11:00"
    };

    Event.findById.mockResolvedValue({ _id: eventId });
    EventSchedule.prototype.save = vi.fn().mockResolvedValue({
      _id: "sched123",
      eventId,
      ...scheduleData,
      createdAt: "2025-09-01T10:00:00.000Z",
      updatedAt: "2025-09-10T10:00:00.000Z"
    });

    const res = await request(app).post(`/event/${eventId}`).send(scheduleData);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(expect.objectContaining({ description: "New Session", startTime: "10:00", endTime: "11:00" }));
    expect(Event.findById).toHaveBeenCalledWith(eventId);
    expect(EventSchedule.prototype.save).toHaveBeenCalled();
  });

  it("should return 404 if event not found on POST", async () => {
    Event.findById.mockResolvedValue(null);

    const res = await request(app).post("/event/507f1f77bcf86cd799439011").send({ description: "X" });

    expect(res.status).toBe(404);
    expect(res.text).toBe("Event not found");
  });

  // ========================
  // PATCH /event/:eventId/schedule/:scheduleId
  // ========================
  it("should update a schedule item", async () => {
    const eventId = "507f1f77bcf86cd799439011";
    const scheduleId = "sched123";
    const updateFields = { description: "Updated Session", startTime: "11:00", endTime: "12:00" };

    const scheduleItem = {
      _id: scheduleId,
      eventId,
      description: "Old",
      startTime: "10:00",
      endTime: "11:00",
      save: vi.fn().mockResolvedValue({
        _id: scheduleId,
        eventId,
        ...updateFields,
        createdAt: "2025-09-01T10:00:00.000Z",
        updatedAt: "2025-09-10T10:00:00.000Z"
      })
    };
    EventSchedule.findOne.mockResolvedValue(scheduleItem);

    const res = await request(app).patch(`/event/${eventId}/schedule/${scheduleId}`).send(updateFields);

    expect(res.status).toBe(200);
    expect(res.body.description).toBe("Updated Session");
    expect(res.body.startTime).toBe("11:00");
    expect(res.body.endTime).toBe("12:00");
    expect(EventSchedule.findOne).toHaveBeenCalledWith({ _id: scheduleId, eventId });
    expect(scheduleItem.save).toHaveBeenCalled();
  });

  it("should return 404 if schedule item not found on PATCH", async () => {
    EventSchedule.findOne.mockResolvedValue(null);

    const res = await request(app).patch("/event/507f1f77bcf86cd799439011/schedule/sched123").send({ description: "X" });

    expect(res.status).toBe(404);
    expect(res.text).toBe("Schedule item not found");
  });

  // ========================
  // DELETE /event/:eventId/schedule/:scheduleId
  // ========================
  it("should delete a schedule item", async () => {
    const eventId = "507f1f77bcf86cd799439011";
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

    const res = await request(app).delete("/event/507f1f77bcf86cd799439011/schedule/sched123");

    expect(res.status).toBe(404);
    expect(res.text).toBe("Schedule item not found");
  });

  it("should handle errors during delete", async () => {
    EventSchedule.findOne.mockRejectedValue(new Error("DB Error"));

    const res = await request(app).delete("/event/507f1f77bcf86cd799439011/schedule/sched123");

    expect(res.status).toBe(500);
    expect(res.text).toBe("Error deleting schedule item");
  });
});
