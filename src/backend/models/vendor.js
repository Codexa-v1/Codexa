import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    vendorType: { type: String, required: true },
    contactPerson: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: String,
    address: { type: String, required: true },
    rating: {type: Number, min: 1, max: 5},
    vendorCost: { type: Number, required: true },
    notes: { type: String },
    contacted: { type: Boolean, default: false },
}, { timestamps: true });

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
