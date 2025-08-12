import mongoose from 'mongoose';

const guest = new mongoose.Schema({
  // for 
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  eventId: { type: Number, required: true },
  rsvpStatus: { type: String, enum: ['Pending', 'Accepted', 'Declined'], default: 'Pending', required: true },
  dietaryPreferences: { type: String, default: '' },
}, { timestamps: true});

export default mongoose.model('Guest', guest);