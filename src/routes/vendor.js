// Manage venues, catering, and other services.
import express from 'express';
import Event from '../models/event';
import Vendor from '../models/vendor';
const router = express.Router();

// Define your routes here

router.get('/event/:id/vendors', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('vendors');
        if (!event) return res.status(404).send('Event not found');

        res.status(200).json(event);
    } catch (error) {
        res.status(500).send('Error retrieving event');
    }
});

router.post('/event/:id/vendors', async (req, res) => {
    const newVendor = new Vendor(req.body);
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).send('Event not found');

        const savedVendor = await newVendor.save();
        event.vendors.push(savedVendor._id);
        await event.save();

        res.status(201).json(savedVendor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/event/:eventId/vendors/:vendorId', async (req, res) => {
    const vendorId = req.params.vendorId;
    const updatedData = req.body;

    try {
        const { eventId, guestId } = req.params;

        // Make sure the guest is part of the event
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).send('Event not found');
        if (!event.vendors.includes(vendorId)) {
            return res.status(400).send('Vendor does not belong to this event');
        }

        const updatedVendor = await Vendor.findByIdAndUpdate(vendorId, updatedData, { new: true });
        if (!updatedVendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        res.status(200).json(updatedVendor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/event/:eventId/vendors/:vendorId', async (req, res) => {
    const vendorId = req.params.vendorId;
    try {
         const { eventId, vendorId } = req.params;

        // Find the event and check if vendor is associated
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).send('Event not found');

        const vendorExistsInEvent = event.vendors.includes(vendorId);
        if (!vendorExistsInEvent) {
            return res.status(400).send('Vendor does not belong to this event');
        }

        // Remove vendor from the event
        await Event.findByIdAndUpdate(
            eventId,
            { $pull: { vendors: vendorId } }
        );

        // Optionally: check if vendor is still in use by any other event
        const stillUsed = await Event.exists({ vendors: vendorId });
        if (!stillUsed) {
            await Vendor.findByIdAndDelete(vendorId);
        }

        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Need to make sure that vendors are event specific - need to structure
// database in such a way that this current code works
export default router;