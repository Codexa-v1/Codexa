import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: String, required: true },
});

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
