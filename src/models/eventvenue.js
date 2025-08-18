import mongoose from "mongoose";

const eventVenueSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    venueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venue',
        required: true
    },
    // Optional: Add fields for contract details, status, etc.
    contractDetails: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
}, {timestamps: true});

const EventVenue = mongoose.model('EventVenue', eventVenueSchema);
export default EventVenue;