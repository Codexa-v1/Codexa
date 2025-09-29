import express from 'express';
import Event from '../models/event.js';
import Venue from '../models/venue.js';
import EventVenue from '../models/eventvenue.js';

const router = express.Router();

// Define your routes here

// This is to get all venues for a particular event - if need be, we will implement a get request for a specific venue
import mongoose from 'mongoose';
router.get('/event/:eventId', async (req, res) => {
    const eventId = req.params.eventId;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).send('Invalid event ID');
    }
    try {
        // Step 1: Find all EventVenue entries for this event
        const eventVenues = await EventVenue.find({ eventId });

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
router.post('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    // Log the request body to see what frontend is sending
    console.log("Request body for adding venue:", req.body);

    // Validate event ID
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).send('Invalid event ID');
    }

    // Check that the event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).send('Event not found');

    // Create new Venue
    const newVenue = new Venue({
      venueName: req.body.venueName,
      venueAddress: req.body.venueAddress,
      venueEmail: req.body.venueEmail,
      venuePhone: req.body.venuePhone,
      capacity: Number(req.body.capacity),           // ensure number
      venueStatus: req.body.venueStatus,
      venueCost: Number(req.body.venueCost),         // ensure number
      venueAvailability: req.body.venueAvailability,
      venueImage: req.body.venueImage || '',         // optional
    });

    // Save the venue
    const savedVenue = await newVenue.save();

    // Create EventVenue association
    const newEventVenue = new EventVenue({
      eventId,
      venueId: savedVenue._id
    });
    await newEventVenue.save();

    // Respond with the created venue
    res.status(201).json(savedVenue);

  } catch (error) {
    console.error('Error adding venue:', error);
    res.status(500).send('Error adding venue');
  }
});


// Edit specific venue fields: capacity, cost, status, notes
router.patch('/event/:eventId/venue/:venueId', async (req, res) => {
    try {
        const { eventId, venueId } = req.params;
        const { capacity, venueCost, venueStatus, notes } = req.body;

        // Ensure the venue exists
        const venue = await Venue.findById(venueId);
        if (!venue) {
            return res.status(404).send('Venue not found');
        }

        // Update only the editable fields
        venue.capacity = capacity !== undefined ? Number(capacity) : venue.capacity;
        venue.venueCost = venueCost !== undefined ? Number(venueCost) : venue.venueCost;
        venue.venueStatus = venueStatus || venue.venueStatus;
        venue.notes = notes !== undefined ? notes : venue.notes;

        await venue.save();

        res.status(200).json({ venue });
    } catch (error) {
        console.error('Error updating venue:', error);
        res.status(500).send('Error updating venue');
    }
});


// This is to delete a specific venue in a particular event
router.delete('/event/:eventId/venue/:venueId', async (req, res) => {
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
