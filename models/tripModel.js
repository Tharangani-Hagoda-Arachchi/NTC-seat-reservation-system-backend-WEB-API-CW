import mongoose from "mongoose";
import applyTripHooks from "../hooks/tripHooks.js";

const stationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    time: { type: String, required: true, match: /^([01]\d|2[0-3]):([0-5]\d)$/ }
});

const tripSchema = new mongoose.Schema({
tripId: { 
    type: String, 
    required: true, 
    unique: true 
},  
startLocation: { 
    type: String, 
    required: true 
},
endLocation: { 
    type: String, 
    required: true 
},
date: { 
    type: Date, 
    required: true 
},
startTime: { 
    type: String, 
    required: true, 
    match: /^([01]\d|2[0-3]):([0-5]\d)$/
},  
endTime: { 
    type: String, 
    required: true, 
    match: /^([01]\d|2[0-3]):([0-5]\d)$/
},    
totalTravellingTime: { 
    type: String, 
    required: true 
},  
totalNoOfSeats: { 
    type: Number, 
    required: true 
},
bookedSeats: {
    type: [Number],
    default: []
},
notProvidedSeats: {
    type: [Number],
    default: []
},
availableSeats: {
    type: [Number],
    default: []
    
},
busNo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bus', 
    required: true 
},
routeNo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Route', 
    required: true 
},
tripType: { 
    type: String, 
    enum: ['weekday', 'weekend', 'special'], 
    required: true 
},
bookingAvalability: { 
    type: String, 
    enum: ['available', 'sold out', 'not available'], 
    required: true 
},
tripAvalability: { 
    type: String, 
    enum: ['available', 'cancel'], 
    required: true 
},
stoppedStations: [stationSchema] ,

systemEnteredAdminId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin', 
    required: true 
},
systemEnteredOperatorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Operator', 
    required: false 
},

}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

applyTripHooks(tripSchema);

const Trip = mongoose.model('Trip', tripSchema)

export default Trip;