import mongoose from "mongoose";

const eventVendorSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    vendorCost: {
        type: Number,
        required: true,
        default: 0
    },
    notes: {
        type: String
    },
    contacted: { 
        type: Boolean, default: false 
    },
}, {timestamps: true});

const EventVendor = mongoose.model('EventVendor', eventVendorSchema);
export default EventVendor;
