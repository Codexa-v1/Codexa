// A schedule object will simply have start-time, end-time, and some field to describe what will be happening between the two times
// An event will therefore have many schedule objects

import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  description: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true }
}, { timestamps: true });

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
