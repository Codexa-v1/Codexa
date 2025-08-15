import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    name: { type: String, required: true },
    vendorType: { type: String, required: true },
    contactPerson: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: String,
    address: { type: String, required: true },
    rating: {type: Number, min: 1, max: 5},
    notes: { type: String }
}, { timestamps: true });

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
