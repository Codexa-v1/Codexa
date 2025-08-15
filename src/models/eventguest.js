import mongoose from "mongoose";

const eventGuestSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    guestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guest',
        required: true
    },
    rsvpStatus: {
        type: String,
        enum: ['Pending', 'Accepted', 'Declined'],
        default: 'Pending'
    },
    customNotes: { type: String },
    invitationSent: { type: Boolean, default: false }
}, { timestamps: true });

const EventGuest = mongoose.model('EventGuest', eventGuestSchema);
export default EventGuest;