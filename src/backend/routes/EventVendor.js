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
import mongoose from 'mongoose';
router.get('/event/:eventId', async (req, res) => {
    const eventId = req.params.eventId;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).send('Invalid event ID');
    }
    try {
        // Step 1: Find all EventVendor entries for this event
        const eventVendors = await EventVendor.find({ eventId });

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

// GET: Fetch all EventVendor details for a specific event
router.get("/event/:eventId/details", async (req, res) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).send("Invalid event ID");
  }

  try {
    // Step 1: Find all EventVendor entries for this event
    const eventVendors = await EventVendor.find({ eventId });

    if (eventVendors.length === 0) {
      return res.status(404).send("No vendors found for this event");
    }

    // Step 2: Populate vendor details for each EventVendor
    const detailedVendors = await Promise.all(
      eventVendors.map(async (ev) => {
        const vendor = await Vendor.findById(ev.vendorId);
        if (!vendor) return null; // Skip if vendor not found

        return {
          vendorId: vendor._id,
          vendor: vendor,           // Global vendor info
          eventVendor: ev           // Event-specific info: vendorCost, notes, contacted
        };
      })
    );

    // Filter out nulls in case some vendors were missing
    const result = detailedVendors.filter(v => v !== null);

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching event vendor details:", err);
    res.status(500).send("Error fetching event vendor details");
  }
});


// This is to create a new vendor for a particular event - if need be, we will implement a post request to create a
// vendor with a specific id
router.post('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    // Step 1: Check that the event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).send('Event not found');

    let vendor;

    if (req.body._id) {
      // ✅ Case 1: Existing vendor
      vendor = await Vendor.findById(req.body._id);
      if (!vendor) return res.status(404).send('Vendor not found');
    } else {
      // ✅ Case 2: Create a new vendor
      const vendorData = {
        name: req.body.name,
        vendorType: req.body.vendorType,
        contactPerson: req.body.contactPerson,
        phone: req.body.phone,
        email: req.body.email,
        website: req.body.website || undefined,
        address: req.body.address,
        rating: req.body.rating ? Number(req.body.rating) : undefined,
        vendorCost: req.body.vendorCost ? Number(req.body.vendorCost) : 0, // default R0
        notes: req.body.notes || undefined
      };

      // Validate vendorCost
      if (isNaN(vendorData.vendorCost)) {
        return res.status(400).send('vendorCost must be a number');
      }

      vendor = new Vendor(vendorData);
      await vendor.save();
    }

    // Step 2: Create the EventVendor association
    const newEventVendor = new EventVendor({
      eventId,
      vendorId: vendor._id
    });
    await newEventVendor.save();

    // Step 3: Return the vendor (so frontend can show details)
    res.status(201).json(vendor);

  } catch (error) {
    console.error('Error adding vendor:', error);
    res.status(500).send('Error adding vendor');
  }
});



// This is to edit the details of a specific vendor in a particular event
router.patch('/event/:eventId/vendors/:vendorId', async (req, res) => {
  try {
    const { eventId, vendorId } = req.params;
    const { vendorCost, notes, contacted, ...vendorUpdates } = req.body;

    // Step 1: Validate EventVendor exists
    const eventVendor = await EventVendor.findOne({ eventId, vendorId });
    if (!eventVendor) {
      return res.status(404).send('Vendor not found for this event');
    }

    // Step 2: Update event-specific fields
    if (vendorCost !== undefined) eventVendor.vendorCost = vendorCost;
    if (notes !== undefined) eventVendor.notes = notes;
    if (contacted !== undefined) eventVendor.contacted = contacted;

    await eventVendor.save();

    // Step 3: Update global vendor fields (if provided)
    let updatedVendor = null;
    if (Object.keys(vendorUpdates).length > 0) {
      updatedVendor = await Vendor.findByIdAndUpdate(
        vendorId,
        vendorUpdates,
        { new: true, runValidators: true }
      );
    } else {
      updatedVendor = await Vendor.findById(vendorId);
    }

    res.status(200).json({
      vendor: updatedVendor,
      eventVendor
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

router.get("/search", async (req, res) => {
  try {
    const { category, city } = req.query;

    if (!category && !city) {
      return res.status(400).json({ error: "At least one of category or city is required" });
    }

    // Build search query
    const query = {};
    if (category) {
      query.vendorType = { $regex: category, $options: "i" }; // case-insensitive match
    }
    if (city) {
      query.address = { $regex: city, $options: "i" }; // partial match on address
    }

    const vendors = await Vendor.find(query);
    res.json(vendors);
  } catch (err) {
    console.error("Error searching vendors:", err);
    res.status(500).json({ error: "Failed to search vendors" });
  }
});
    

export default router;
