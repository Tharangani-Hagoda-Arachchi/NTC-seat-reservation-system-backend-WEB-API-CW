
import Trip from '../models/tripModel.js';
import { addDays, isWeekend } from 'date-fns'; // Ensure date-fns is installed
import validateTripReferences from '../validators/tripReferenceValidator.js';
import {initializeTripData}  from '../middlewares/tripMiddleware.js'
import { validateAndAssignAdminOrOperator } from '../validators/busAddUpdatePersonAsigner.js';
import { checkIfTripAlreadyScheduled } from '../middlewares/tripMiddleware.js';
import crypto from 'crypto'
import { ro } from 'date-fns/locale';


export const addNewWeekDayTrip = async (req, res, next) => {
    try {

        //extract data from req body
        const { startLocation, endLocation, startTime, endTime, totalTravellingTime, busNo, routeNo, stoppedStations } = req.body;
        
        //calling function in tripReferencevalidator.js for validate route no and bus no references
        const { route, bus } = await validateTripReferences(routeNo, busNo);
        
        //calling function in tripMiddleware.js for inititalized trip data
        const tripData = await initializeTripData(busNo);
        
        //asign tripType as weekday
        const weekTripType = 'weekday';
        
        //functon to capitalize first letter in start and end station
        const capitalizeFirstLetter = (str) => {
            if (!str || typeof str !== 'string') return '';
            return str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase();
        };
        const normalizedStartLocation = capitalizeFirstLetter(startLocation);
        const normalizedEndLocation = capitalizeFirstLetter(endLocation);
        
        //calling function in busAddUpdatePersonAsigner.js 
        const systemEnteredId = await validateAndAssignAdminOrOperator(req);
        
        // generate unique trip id
        const generateTripID = () => {
            const timestamp = Date.now().toString().slice(-6); // Last 6 digits of the timestamp
            const randomPart = crypto.randomBytes(3).toString('hex'); // 3 bytes = 6 hex characters
            return `weekdaytrip-${timestamp}-${randomPart}`;  // Format: trip-{timestamp}-{randomString}
        };

        // Get today's date and find the next weekday
        let currentDate = new Date();
        const tripsToSave = [];
        

        // Loop through the next 14 days (2 weeks)
        for (let i = 0; i < 14; i++) {

            
            // Check if the current day is a weekday
            if (!isWeekend(currentDate)) {
                
                // convert date in to 'YYYY-MM-DD'
                const dateString = currentDate.toISOString().split('T')[0];

                // call function in tripMiddleware.js to check already trip is sheduled
                const existingTrip = await checkIfTripAlreadyScheduled(normalizedStartLocation,normalizedEndLocation,startTime,endTime,dateString,route._id);

                if (existingTrip) {
                    // If a trip exists with the same details, send a response and skip the trip
                    return res.status(400).json({
                        message: `Trip is already scheduled for ${normalizedStartLocation} to ${normalizedEndLocation} on ${dateString} with the same times and route.`
                    });
                }
                const tripSaveData = {
                    tripId : generateTripID(),
                    startLocation: normalizedStartLocation,
                    endLocation: normalizedEndLocation,
                    date: dateString, // Format to YYYY-MM-DD
                    startTime,
                    endTime,
                    totalTravellingTime,
                    totalNoOfSeats: tripData.totalNoOfSeats,
                    bookedSeats: tripData.bookedSeats,
                    notProvidedSeats: tripData.notProvidedSeats,
                    busNo: tripData.busNo,
                    routeNo:route._id,
                    tripType: weekTripType,
                    bookingAvalability: tripData.bookingAvalability,
                    tripAvalability: tripData.tripAvailability,
                    stoppedStations,
                    ...systemEnteredId,
                };

                tripsToSave.push(tripSaveData,);
            }

            // Move to the next day
            currentDate = addDays(currentDate, 1);
        }

        // Save all trips to the database
        await Trip.insertMany(tripsToSave);

        res.status(200).json({
            message: 'Trips scheduled successfully for all weekdays in the next 2 weeks!',
        });
        next()
        
    } catch (error) {
        next(error);
    }
};
