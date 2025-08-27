// routes/schedule.js

// How this is going to work:
// Every piece of information will be in the following format - the user will select a time range, and put in a description for that period
// Then, we put this information in one object, and send it to the database
// We send this information along with the eventId

import express from "express";
import Event from "../models/event.js";
import EventSchedule from "../models/eventschedule.js";

const router = express.Router();

// Get all schedule items for a particular event
router.get("/event/:eventId", async (req, res) => {
  const { eventId } = req.params;
  try {
    const schedules = await EventSchedule.find({ eventId });
    res.json(schedules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// Add a new schedule item for an event
router.post("/event/:eventId", async (req, res) => {
    try {
        const { eventId } = req.params;
        const { description, startTime, endTime } = req.body;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).send("Event not found");

        const newScheduleItem = new EventSchedule({
            eventId,
            description,
            startTime,
            endTime
        });

        const savedItem = await newScheduleItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        console.error("Error adding schedule:", err);
        res.status(500).send("Error adding schedule");
    }
});

// Edit a specific schedule item
router.patch("/event/:eventId/schedule/:scheduleId", async (req, res) => {
    try {
        const { eventId, scheduleId } = req.params;
        const updateFields = req.body;

        const scheduleItem = await EventSchedule.findOne({ _id: scheduleId, eventId });
        if (!scheduleItem) return res.status(404).send("Schedule item not found");

        Object.assign(scheduleItem, updateFields);
        const updatedItem = await scheduleItem.save();

        res.status(200).json(updatedItem);
    } catch (err) {
        console.error("Error updating schedule item:", err);
        res.status(500).send("Error updating schedule item");
    }
});

// Delete a schedule item
router.delete("/event/:eventId/schedule/:scheduleId", async (req, res) => {
    try {
        const { eventId, scheduleId } = req.params;

        const scheduleItem = await EventSchedule.findOne({ _id: scheduleId, eventId });
        if (!scheduleItem) return res.status(404).send("Schedule item not found");

        await scheduleItem.deleteOne();
        res.status(204).send();
    } catch (err) {
        console.error("Error deleting schedule item:", err);
        res.status(500).send("Error deleting schedule item");
    }
});

export default router;
