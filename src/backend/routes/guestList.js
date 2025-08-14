// Add, update, and retrieve guest details and RSVP status.
// Guests are event specific - need to get an event with the correct ID and then look at the guests for that
// particular event
import express from 'express';
import Event from '../models/event.js';
import Guest from '../models/guest.js';

const router = express.Router();

router.get('/event/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('guests');
        if (!event) return res.status(404).send('Event not found');

        res.status(200).json(event);
    } catch (error) {
        res.status(500).send('Error retrieving event');
    }
});

router.post('/event/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).send('Event not found');

        const newGuest = new Guest({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            rsvpStatus: req.body.rsvpStatus,
            dietaryPreferences: req.body.dietaryPreferences
        });

        const savedGuest = await newGuest.save();
        event.guests.push(savedGuest._id);
        await event.save();
        res.status(201).json(savedGuest);
    } catch (error) {
        res.status(500).send('Error adding guest');
    }
});

router.put('/event/:eventId/guest/:guestId', async (req, res) => {
    try {
        const { eventId, guestId } = req.params;

        // Make sure the guest is part of the event
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).send('Event not found');
        if (!event.guests.includes(guestId)) {
            return res.status(400).send('Guest does not belong to this event');
        }

        // Update guest
        const updatedGuest = await Guest.findByIdAndUpdate(guestId, req.body, { new: true });
        if (!updatedGuest) return res.status(404).send('Guest not found');

        res.status(200).json(updatedGuest);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating guest');
    }
});


router.delete('/event/:eventId/guest/:guestId', async (req, res) => {
    try {
        const { eventId, guestId } = req.params;

        // Find the event and check if guest is associated
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).send('Event not found');

        const guestExistsInEvent = event.guests.includes(guestId);
        if (!guestExistsInEvent) {
            return res.status(400).send('Guest does not belong to this event');
        }

        // Remove guest from the event
        await Event.findByIdAndUpdate(
            eventId,
            { $pull: { guests: guestId } }
        );

        // Optionally: check if guest is still in use by any other event
        const stillUsed = await Event.exists({ guests: guestId });
        if (!stillUsed) {
            await Guest.findByIdAndDelete(guestId);
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting guest from event');
    }
});

export default router;