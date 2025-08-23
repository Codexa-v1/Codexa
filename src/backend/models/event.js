import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    eventPlanner: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Planned', 'Ongoing', 'Completed', 'Cancelled'], 
        default: 'Planned' 
    },
    budget: {
        type: Number,
        required: true
    },
    capacity: Number,
    category: { type: String, required: true },
    organizer: {
        name: String,
        contact: String,
        email: String
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    floorplan: { type: String, required: true }, // url to a picture of the floorplans
    rsvpCurrent: { type: Number, default: 0 },
    rsvpTotal: { type: Number, default: 0 }
}, {timestamps: true});

eventSchema.pre('save', function(next) {
    if (this.category && typeof this.category === 'string') {
        this.category = this.category.charAt(0).toUpperCase() + this.category.slice(1).toLowerCase();
    }
    next();
});


const Event = mongoose.model("Event", eventSchema);

export default Event;
