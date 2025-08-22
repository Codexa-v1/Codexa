import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    venueAddress: { type: String, required: true },
    venueName: { type: String, required: true },
    venueImage: { type: String }, // Optional
}, {timestamps: true});

const Venue = mongoose.model("Venue", eventSchema);

export default Venue;