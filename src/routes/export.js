// Provide downloadable event packages for other apps.
import express from 'express';
const router = express.Router();

// Define your routes here
router.get('/event/:eventId', (req, res) => {
    const eventId = req.params.eventId;
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