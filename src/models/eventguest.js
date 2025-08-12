const mongoose = require('mongoose');

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
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    },
    customNotes: { type: String },
    invitationSent: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('EventGuest', eventGuestSchema);