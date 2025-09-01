// Provide downloadable event packages for other apps.
import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import Event from '../models/event.js';

// Define your routes here
router.get('/event/:eventId', (req, res) => {
    const eventId = req.params.eventId;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ message: 'Invalid event ID' });
    }
    Event.findById(eventId)
        .then(event => {
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }
            res.json(event);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        });
});

export default router;

// Same as eventData, but only need to get events.