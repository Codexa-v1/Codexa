import mongoose from 'mongoose';

const guest = new mongoose.Schema({
  // for id, just use the automatically created field in mongo
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  eventId: { type: String, required: true },
  rsvpStatus: { type: String, enum: ['Pending', 'Accepted', 'Declined'], default: 'Pending', required: true },
  dietaryPreferences: { type: String, default: '' },
}, { timestamps: true});

const Guest = mongoose.model('Guest', guest);

export default Guest;