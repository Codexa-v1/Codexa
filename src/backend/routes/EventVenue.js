import express from 'express';
import Event from '../models/event.js';
import Venue from '../models/venue.js';
import EventVenue from '../models/eventvenue.js';

const router = express.Router();

// Define your routes here

// This is to get all venues for a particular event - if need be, we will implement a get request for a specific venue
router.get('/event/:eventId/venues', async (req, res) => {
    try {
        // Step 1: Find all EventVenue entries for this event
        const eventVenues = await EventVenue.find({ eventId: req.params.eventId });

        if (eventVenues.length === 0) {
            return res.status(404).send('No venues found for this event');
        }

        // Step 2: Extract venueId's from those records
        const venueIds = eventVenues.map(eg => eg.venueId);

        // Step 3: Find Venue documents where _id is in the list of venueIds
        const venues = await Venue.find({ _id: { $in: venueIds } });

        res.status(200).json(venues);
    } catch (error) {
        console.error('Error retrieving venues:', error);
        res.status(500).send('Error retrieving venues');
    }
});

// This is to create a new venue for a particular event - if need be, we will implement a post request to create a
// venue with a specific id
router.post('/event/:eventId/venues', async (req, res) => {
    try {
        const { eventId } = req.params;

        // Step 1: Check that the event exists
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).send('Event not found');

        // Step 2: Create the Venue
        const newVenue = new Venue({
            venueAddress: req.body.venueAddress,
            venueName: req.body.venueName,
            venueImage: req.body.venueImage,
        });

        const savedVenue = await newVenue.save();

        // Step 3: Create the EventVenue association
        const newEventVenue = new EventVenue({
            eventId,
            venueId: savedVenue._id
        });

        await newEventVenue.save();

        // Step 4: Return the created venue
        res.status(201).json(savedVenue);
    } catch (error) {
        console.error('Error adding venue:', error);
        res.status(500).send('Error adding venue');
    }
});


// This is to edit the details of a specific venue in a particular event
router.patch('/event/:eventId/venues/:venueId', async (req, res) => {
    try {
        const { eventId, venueId } = req.params;
        const updateFields = req.body;

        // Validate EventVenue exists and belongs to this event and venue
        const eventVenue = await EventVenue.findOne({ eventId, venueId });

        if (!eventVenue) {
            return res.status(404).send('Venue not found for this event');
        }

        // Update Venue fields
        const updatedVenue = await Venue.findByIdAndUpdate(
            venueId,
            updateFields,
            { new: true, runValidators: true }
        );

        if (!updatedVenue) {
            return res.status(404).send('Venue not found');
        }

        // If you have event-specific fields in EventVenue, update them here - but we don't have such information
        // Example: if (updateFields.notes) { eventVenue.notes = updateFields.notes; await eventVenue.save(); }

        res.status(200).json({
            venue: updatedVenue
        });
    } catch (error) {
        console.error('Error updating venue:', error);
        res.status(500).send('Error updating venue');
    }
});

// This is to delete a specific venue in a particular event
router.delete('/event/:eventId/venues/:venueId', async (req, res) => {
    try {
        const { eventId, venueId } = req.params;

        // Step 1: Check that venue is linked to this event
        const eventVenue = await EventVenue.findOne({ eventId, venueId });
        if (!eventVenue) {
            return res.status(404).send('Venue not found for this event');
        }

        // Step 2: Delete the EventVenue association
        await EventVenue.deleteOne({ eventId, venueId });

        // Step 3: Check if venue is used in any other event
        const stillUsed = await EventVenue.exists({ venueId });
        if (!stillUsed) {
            await Venue.findByIdAndDelete(venueId);
        }

        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;