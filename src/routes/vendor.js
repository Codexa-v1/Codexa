// Manage venues, catering, and other services.
import express from 'express';
import Vendor from '../models/vendor';
const router = express.Router();

// Define your routes here

router.get('/', async (req, res) => {
    try {
        const vendors = await Vendor.find();
        res.json(vendors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', async (req, res) => {
    const newVendor = new Vendor(req.body);
    try {
        const savedVendor = await newVendor.save();
        res.status(201).json(savedVendor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', async (req, res) => {
    const vendorId = req.params.id;
    const updatedData = req.body;

    try {
        const updatedVendor = await Vendor.findByIdAndUpdate(vendorId, updatedData, { new: true });
        if (!updatedVendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        res.json(updatedVendor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', async (req, res) => {
    const vendorId = req.params.id;
    try {
        const deletedVendor = await Vendor.findByIdAndDelete(vendorId);
        if (!deletedVendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        res.json({ message: 'Vendor deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Need to make sure that vendors are event specific - need to structure
// database in such a way that this current code works
export default router;