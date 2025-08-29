// Add, update, and retrieve guest details and RSVP status.

// Here, we will extract data from the EventGuests collection on MongoDB - remember that it uses foreign keys
// from the event collection and the guest collection

import express from 'express';
import Event from '../models/event.js';
import Guest from '../models/guest.js';
import EventGuest from "../models/eventguest.js";

const router = express.Router();

// This is to get all the guests in an event - if need be, we will implement the get request for a single guest
router.get('/event/:eventId', async (req, res) => {
    try {
        // Step 1: Find all EventGuest entries for this event
        const eventGuests = await EventGuest.find({ eventId: req.params.eventId });

        if (eventGuests.length === 0) {
            return res.status(404).send('No guests found for this event');
        }

        // Step 2: Extract guestId's from those records
        const guestIds = eventGuests.map(eg => eg.guestId);

        // Step 3: Find Guest documents where _id is in the list of guestIds
        const guests = await Guest.find({ _id: { $in: guestIds } });

        res.status(200).json(guests);
    } catch (error) {
        console.error('Error retrieving guests:', error);
        res.status(500).send('Error retrieving guests');
    }
});

// This is to create a guest for an event - if need be, we will implement the post request to add a guest with a
// specific id
router.post('/event/:eventId', async (req, res) => {
    try {
        // Step 1: Verify the event exists
        const event = await Event.findById(req.params.eventId);
        if (!event) return res.status(404).send('Event not found');

        // Step 2: Create and save the guest
        const newGuest = new Guest({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            rsvpStatus: req.body.rsvpStatus, // optional, default is fine
            dietaryPreferences: req.body.dietaryPreferences,
            eventId: req.params.eventId  // <-- match Guest to event if still needed in Guest schema
        });

        const savedGuest = await newGuest.save();

        // Step 3: Create the EventGuest link
        const newEventGuest = new EventGuest({
            eventId: event._id,
            guestId: savedGuest._id,
            rsvpStatus: req.body.rsvpStatus || 'pending',
            customNotes: req.body.customNotes || '',
            invitationSent: req.body.invitationSent || false
        });

        await newEventGuest.save();

        // Step 4: Respond with the newly created guest
        res.status(201).json(savedGuest);
    } catch (error) {
        console.error('Error adding guest:', error);
        res.status(500).send('Error adding guest');
    }
});

// This is to alter the information of a particular guest in a particular event
router.patch('/event/:eventId/guest/:guestId', async (req, res) => {
    try {
        const { eventId, guestId } = req.params;
        const { name, email, phone, rsvpStatus, dietaryPreferences } = req.body;

        // Validate EventGuest exists and belongs to this event and guest
        const eventGuest = await EventGuest.findOne({ eventId, guestId });

        if (!eventGuest) {
            return res.status(404).send('Guest not found for this event');
        }

        // Update Guest fields
        const updatedGuest = await Guest.findByIdAndUpdate(
            guestId,
            { name, email, phone, rsvpStatus, dietaryPreferences },
            { new: true, runValidators: true }
        );

        if (!updatedGuest) {
            return res.status(404).send('Guest not found');
        }

        // Update RSVP status (or other event-specific fields)
        const updatedEventGuest = await EventGuest.findByIdAndUpdate(
            eventGuest._id,
            { rsvpStatus },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            guest: updatedGuest,
            eventGuest: updatedEventGuest
        });
    } catch (error) {
        console.error('Error updating guest:', error);
        res.status(500).send('Error updating guest');
    }
});



// THis is to delete a particular guest in a particular event
router.delete('/event/:eventId/guest/:guestId', async (req, res) => {
    try {
        const { eventId, guestId } = req.params;

        // Step 1: Find the EventGuest entry to validate guest belongs to event
        const eventGuest = await EventGuest.findOne({
            eventId,
            guestId
        });

        if (!eventGuest) {
            return res.status(404).send('Guest not found for this event');
        }

        // Step 2: Remove the EventGuest link (guest-event relation)
        await EventGuest.deleteOne({ eventId, guestId });

        // Step 3: Check if guest is still linked to any other event
        const stillLinked = await EventGuest.exists({ guestId });

        // Step 4: If not linked anywhere else, delete the guest
        if (!stillLinked) {
            await Guest.findByIdAndDelete(guestId);
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting guest:', error);
        res.status(500).send('Error deleting guest from event');
    }
});

export default router;