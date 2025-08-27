// Event metadata (theme, date, schedule, maps).
import express from 'express';
import Event from '../models/event.js';
const router = express.Router();

// Define your routes here

router.get('/:id', (req, res) => {
    const eventId = req.params.id;
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

router.patch('/:id', async (req, res) => {
    const eventId = req.params.id;
    const updatedData = req.body;

    try {
        const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedData, {
            new: true,
            runValidators: true
        });
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(updatedEvent);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', async (req, res) => {
    const newEvent = new Event(req.body);
    try {
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', async (req, res) => {
    const eventId = req.params.id;
    try {
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
// GET all events by userId (eventPlanner) via request param
// Here, we do not need to worry about eventId, since we are fetching all events for a specific user.
router.get('/all/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ error: 'Missing userId request parameter' });
        }
        const events = await Event.find({ eventPlanner: userId });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;