import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  title: { type: String, required: true },
  description: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true }
}, { timestamps: true });

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
