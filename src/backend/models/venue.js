import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    venueName: { type: String, required: true },
    venueAddress: { type: String, required: true },
    venueEmail: { type: String, required: true },
    venuePhone: { type: String, required: true },
    capacity: { type: Number, required: true },
    venueStatus: { type: String, required: true },
    venueImage: { type: String }, // Optional
}, {timestamps: true});

const Venue = mongoose.model("Venue", eventSchema);

export default Venue;