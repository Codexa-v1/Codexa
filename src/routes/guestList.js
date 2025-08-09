// Add, update, and retrieve guest details and RSVP status.
import express from 'express';
import Guest from '../models/guest.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const guests = await Guest.find();
        res.status(200).json(guests);
    } catch (error) {
        res.status(500).send('Error retrieving guests');
    }
});

router.post('/', async (req, res) => {
    try {
        console.log("Post called");
        const newGuest = new Guest({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            rsvpStatus: req.body.rsvpStatus,
            dietaryPreferences: req.body.dietaryPreferences
        });

        const savedGuest = await newGuest.save();
        res.status(201).json(savedGuest);
    } catch (error) {
        res.status(500).send('Error adding guest');
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updated = await Guest.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
});

router.delete('/:id', async (req, res) => {
    await Guest.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

export default router;