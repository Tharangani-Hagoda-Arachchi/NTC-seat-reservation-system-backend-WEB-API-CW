import mongoose from "mongoose";


// Define the User Schema
const routeSchema = new mongoose.Schema({
    routeNo: {
        type: String,
        unique: true
    },

    startLocation: {
        type: String,
        required: true,
        trim: true
    },
    
    endLocation: {
        type: String,
        required: true,
        trim: true
    },
    totalDistanceIn_km: {
        type: Number,
        required: true  
    }
}, );


// Create the User model
const Route = mongoose.model('Route', routeSchema);

export default Route;
