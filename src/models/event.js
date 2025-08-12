import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    eventId: {type: Number, required: true},
    title: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    floorplan: { type: String, required: true }, // url to a picture of the floorplans
    guests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Guest' }],
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
