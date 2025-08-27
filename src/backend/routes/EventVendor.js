// Manage venues, catering, and other services.

// Here, we will extract data from the EventVendor collection on MongoDB - remember that it uses foreign keys
// from the event collection and the vendor collection

import express from 'express';
import Event from '../models/event.js';
import Vendor from '../models/vendor.js';
import EventVendor from '../models/eventvendor.js';

const router = express.Router();

// Define your routes here

// This is to get all vendors for a particular event - if need be, we will implement a get request for a specific vendor
router.get('/event/:eventId/vendors', async (req, res) => {
    try {
        // Step 1: Find all EventVendor entries for this event
        const eventVendors = await EventVendor.find({ eventId: req.params.eventId });

        if (eventVendors.length === 0) {
            return res.status(404).send('No vendors found for this event');
        }

        // Step 2: Extract vendorId's from those records
        const vendorIds = eventVendors.map(eg => eg.vendorId);

        // Step 3: Find Vendor documents where _id is in the list of vendorIds
        const vendors = await Vendor.find({ _id: { $in: vendorIds } });

        res.status(200).json(vendors);
    } catch (error) {
        console.error('Error retrieving vendors:', error);
        res.status(500).send('Error retrieving vendors');
    }
});

// This is to create a new vendor for a particular event - if need be, we will implement a post request to create a
// vendor with a specific id
router.post('/event/:eventId/vendors', async (req, res) => {
    try {
        const { eventId } = req.params;

        // Step 1: Check that the event exists
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).send('Event not found');

        // Step 2: Create the Vendor
        const newVendor = new Vendor({
            name: req.body.name,
            vendorType: req.body.vendorType,
            contactPerson: req.body.contactPerson,
            phone: req.body.phone,
            email: req.body.email,
            website: req.body.website,
            address: req.body.address,
            rating: req.body.rating,
            notes: req.body.notes
        });

        const savedVendor = await newVendor.save();

        // Step 3: Create the EventVendor association
        const newEventVendor = new EventVendor({
            eventId,
            vendorId: savedVendor._id
        });

        await newEventVendor.save();

        // Step 4: Return the created vendor
        res.status(201).json(savedVendor);
    } catch (error) {
        console.error('Error adding vendor:', error);
        res.status(500).send('Error adding vendor');
    }
});


// This is to edit the details of a specific vendor in a particular event
router.patch('/event/:eventId/vendors/:vendorId', async (req, res) => {
    try {
        const { eventId, vendorId } = req.params;
        const updateFields = req.body;

        // Validate EventVendor exists and belongs to this event and vendor
        const eventVendor = await EventVendor.findOne({ eventId, vendorId });

        if (!eventVendor) {
            return res.status(404).send('Vendor not found for this event');
        }

        // Update Vendor fields
        const updatedVendor = await Vendor.findByIdAndUpdate(
            vendorId,
            updateFields,
            { new: true, runValidators: true }
        );

        if (!updatedVendor) {
            return res.status(404).send('Vendor not found');
        }

        // If you have event-specific fields in EventVendor, update them here - but we don't have such information
        // Example: if (updateFields.notes) { eventVendor.notes = updateFields.notes; await eventVendor.save(); }

        res.status(200).json({
            vendor: updatedVendor
        });
    } catch (error) {
        console.error('Error updating vendor:', error);
        res.status(500).send('Error updating vendor');
    }
});

// This is to delete a specific vendor in a particular event
router.delete('/event/:eventId/vendors/:vendorId', async (req, res) => {
    try {
        const { eventId, vendorId } = req.params;

        // Step 1: Check that vendor is linked to this event
        const eventVendor = await EventVendor.findOne({ eventId, vendorId });
        if (!eventVendor) {
            return res.status(404).send('Vendor not found for this event');
        }

        // Step 2: Delete the EventVendor association
        await EventVendor.deleteOne({ eventId, vendorId });

        // Step 3: Check if vendor is used in any other event
        const stillUsed = await EventVendor.exists({ vendorId });
        if (!stillUsed) {
            await Vendor.findByIdAndDelete(vendorId);
        }

        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;