import mongoose from 'mongoose';

const guest = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  rsvpStatus: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  },
  dietaryPreferences: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Guest', guest);