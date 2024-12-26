import Bus from "../models/busModel.js";
import Trip from "../models/tripModel.js";

export const initializeTripData = async (busNo) => {
    try{
     // Fetch bus details by busNo
     const bus = await Bus.findOne({ busNo });
    if (!bus) {
        throw new Error('Invalid bus number. Bus not found.');
    }
    
    // Initialize trip data
    return {
        busNo: bus._id,
        totalNoOfSeats: bus.totalNoOfSeats,
        bookedSeats: [], // Initialize as an empty array
        notProvidedSeats: [], // Initialize as an empty array
        tripAvailability: 'available',
        bookingAvalability: 'available',
        tripDate: new Date().toISOString().split('T')[0]
    };    

    } catch(error){
        next(error)   
    }
}

// chechk already trip is sheduled
export const checkIfTripAlreadyScheduled = async (startLocation, endLocation, startTime, endTime,dateString,routeNo) => {
    try {
            // Query the database to find an existing trip
        const existingTrip = await Trip.findOne({
            startLocation,
            endLocation,
            startTime,
            endTime,
            date: dateString,
            routeNo: routeNo 
           
        });
    
        return existingTrip; // Returns null if no trip exists
    } catch (error) {
        throw new Error('Error checking for existing trip: ' + error.message);
     }
};
        
   
