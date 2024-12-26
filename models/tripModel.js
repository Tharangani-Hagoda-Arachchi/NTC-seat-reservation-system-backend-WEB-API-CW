import mongoose from "mongoose";

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


//hook to calculate availability seats
tripSchema.pre('insertMany', function (next, docs) {
    docs.forEach(doc => {
        
        const totalSeats = doc.totalNoOfSeats;
        const notProvidedSeats = doc.notProvidedSeats; // Might be empty
        const bookedSeats = doc.bookedSeats;           // Might be empty

        const allSeats = Array.from({ length: totalSeats }, (_, i) => i + 1);
        doc.availableSeats = allSeats.filter(seat => 
            !notProvidedSeats.includes(seat) && !bookedSeats.includes(seat)
        );
    });

    next();
});

const Trip = mongoose.model('Trip', tripSchema)

export default Trip;