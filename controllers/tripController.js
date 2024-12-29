import Trip from '../models/tripModel.js';
import { AppError } from '../utils/errorHandler.js';
import { addDays, isWeekend } from 'date-fns'; // Ensure date-fns is installed
import validateTripReferences from '../validators/tripReferenceValidator.js';
import {initializeTripData}  from '../middlewares/tripMiddleware.js'
import { validateAndAssignAdminOrOperator } from '../validators/busAddUpdatePersonAsigner.js';
import { checkIfTripAlreadyScheduled } from '../middlewares/tripMiddleware.js';
import crypto from 'crypto'
import { ro } from 'date-fns/locale';
import Booking from '../models/bookingModel.js';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//create new weekdays trips
export const addNewWeekDayTrip = async (req, res, next) => {
    try {

        //extract data from req body
        const { startLocation, endLocation, startTime, endTime, totalTravellingTime, busNo, routeNo,feePerSeatInLKR, stoppedStations } = req.body;
        
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
                    feePerSeatInLKR,
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


// crete new weekends trips
export const addNewWeekendTrip = async (req, res, next) => {
    try {
        // Extract data from req body
        const { startLocation, endLocation, startTime, endTime, totalTravellingTime, busNo, routeNo,feePerSeatInLKR, stoppedStations } = req.body;

         //calling function in tripReferencevalidator.js for validate route no and bus no references
        const { route, bus } = await validateTripReferences(routeNo, busNo);

         //calling function in tripMiddleware.js for inititalized trip data
        const tripData = await initializeTripData(busNo);

        // Assign tripType as weekend
        const weekendTripType = 'weekend';

        // Function to capitalize first letter in start and end station
        const capitalizeFirstLetter = (str) => {
            if (!str || typeof str !== 'string') return '';
            return str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase();
        };
        const normalizedStartLocation = capitalizeFirstLetter(startLocation);
        const normalizedEndLocation = capitalizeFirstLetter(endLocation);

       //calling function in busAddUpdatePersonAsigner.js 
        const systemEnteredId = await validateAndAssignAdminOrOperator(req);

        // Generate unique trip ID
        const generateTripID = () => {
            const timestamp = Date.now().toString().slice(-6); // Last 6 digits of the timestamp
            const randomPart = crypto.randomBytes(3).toString('hex'); // 3 bytes = 6 hex characters
            return `weekendtrip-${timestamp}-${randomPart}`;
        };

        // Get today's date and find the next weekend
        let currentDate = new Date();
        const tripsToSave = [];

        // Loop through the next 14 days (2 weeks)
        for (let i = 0; i < 14; i++) {
            // Check if the current day is a weekend
            if (isWeekend(currentDate)) {
                // Convert date into 'YYYY-MM-DD'
                const dateString = currentDate.toISOString().split('T')[0];

                // Check if a trip is already scheduled
                const existingTrip = await checkIfTripAlreadyScheduled(
                    normalizedStartLocation,
                    normalizedEndLocation,
                    startTime,
                    endTime,
                    dateString,
                    route._id
                );

                if (existingTrip) {
                    return res.status(400).json({
                        message: `Trip is already scheduled for ${normalizedStartLocation} to ${normalizedEndLocation} on ${dateString} with the same times and route.`
                    });
                }

                const tripSaveData = {
                    tripId: generateTripID(),
                    startLocation: normalizedStartLocation,
                    endLocation: normalizedEndLocation,
                    date: dateString,
                    startTime,
                    endTime,
                    totalTravellingTime,
                    totalNoOfSeats: tripData.totalNoOfSeats,
                    bookedSeats: tripData.bookedSeats,
                    notProvidedSeats: tripData.notProvidedSeats,
                    busNo: tripData.busNo,
                    routeNo: route._id,
                    feePerSeatInLKR,
                    tripType: weekendTripType,
                    bookingAvalability: tripData.bookingAvalability,
                    tripAvalability: tripData.tripAvailability,
                    stoppedStations,
                    ...systemEnteredId,
                };

                tripsToSave.push(tripSaveData);
            }

            // Move to the next day
            currentDate = addDays(currentDate, 1);
        }

        // Save all trips to the database
        await Trip.insertMany(tripsToSave);

        res.status(200).json({
            message: 'Trips scheduled successfully for all weekends in the next 2 weeks!',
        });
        next();
    } catch (error) {
        next(error);
    }
};




// crete new special trips
export const addNewSpecialTrip = async (req, res, next) => {
    try {
        // Extract data from req body
        const { startLocation, endLocation, date, startTime, endTime, totalTravellingTime, busNo, routeNo, feePerSeatInLKR, stoppedStations } = req.body;

         //calling function in tripReferencevalidator.js for validate route no and bus no references
        const { route, bus } = await validateTripReferences(routeNo, busNo);

         //calling function in tripMiddleware.js for inititalized trip data
        const tripData = await initializeTripData(busNo);

        // Assign tripType as special
        const specialTripType = 'special';

        // Function to capitalize first letter in start and end station
        const capitalizeFirstLetter = (str) => {
            if (!str || typeof str !== 'string') return '';
            return str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase();
        };
        const normalizedStartLocation = capitalizeFirstLetter(startLocation);
        const normalizedEndLocation = capitalizeFirstLetter(endLocation);

       //calling function in busAddUpdatePersonAsigner.js 
        const systemEnteredId = await validateAndAssignAdminOrOperator(req);

        // Generate unique trip ID
        const generateTripID = () => {
            const timestamp = Date.now().toString().slice(-6); // Last 6 digits of the timestamp
            const randomPart = crypto.randomBytes(3).toString('hex'); // 3 bytes = 6 hex characters
            return `specialtrip-${timestamp}-${randomPart}`;
        };

        const existingTrip = await checkIfTripAlreadyScheduled(
            normalizedStartLocation,
            normalizedEndLocation,
            startTime,
            endTime,
            date,
            route._id
        );

        if (existingTrip) {
            return res.status(400).json({
                message: `Trip is already scheduled for ${normalizedStartLocation} to ${normalizedEndLocation} on ${date} with the same times and route.`
            });
        }

        const tripsToSave = [];

        const tripSaveData = {
            tripId: generateTripID(),
            startLocation: normalizedStartLocation,
            endLocation: normalizedEndLocation,
            date,
            startTime,
            endTime,
            totalTravellingTime,
            totalNoOfSeats: tripData.totalNoOfSeats,
            bookedSeats: tripData.bookedSeats,
            notProvidedSeats: tripData.notProvidedSeats,
            busNo: tripData.busNo,
            routeNo: route._id,
            feePerSeatInLKR,
            tripType: specialTripType,
            bookingAvalability: tripData.bookingAvalability,
            tripAvalability: tripData.tripAvailability,
            stoppedStations,
            ...systemEnteredId,
        };

        tripsToSave.push(tripSaveData);

        await Trip.insertMany(tripsToSave);

        res.status(200).json({
            message: 'Special Trips scheduled successfully',
        });
        next();
    } catch (error) {
        next(error);
    }
};



// update not provided seat bu trip id
export const updateNotProvidedSeats = async (req, res, next) => {
    try {
        const { tripId } = req.params; 
        const { notProvidedSeats } = req.body;

        // Validate tripId
        if (!tripId || typeof tripId !== 'string') {
            throw new AppError('Valid tripId is required', 422, 'ValidationError');
        }

        // Validate notProvidedSeats
        if (!Array.isArray(notProvidedSeats)) {
            throw new AppError('notProvidedSeats must be an array', 422, 'ValidationError');
        }

        // Fetch the trip with bus and operator details
        const trip = await Trip.findOne({ tripId })
            .populate({
                path: 'busNo',  
                select: 'busNo operatorRegisteredId',
                populate: {
                    path: 'operatorRegisteredId',  
                    select: 'operatorRegisteredId'
                }
            });
    
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
       
        if (String(trip.busNo.operatorRegisteredId._id) !== String(req.operator.operatorId)) {
            return res.status(403).json({ message: 'Forbidden: Operator ID mismatch' });
        }

        // Validate and assign systemEnteredId
        const systemEnteredId = await validateAndAssignAdminOrOperator(req);

        // Perform the update
        const updatedTrip = await Trip.findOneAndUpdate(
            { tripId },
            { 
                notProvidedSeats, 
                systemEnteredId 
            }, 
            { new: true }
        );

        res.status(200).json({
            message: `Not provided seats for Bus No '${trip.busNo.busNo}' updated successfully.`,
            
        });

        next();
    } catch (error) {
        next(error); // Pass error to global error handler
    }
};

export const cancelTrip= async (req, res, next) => {
    try {
        const { tripId } = req.params; 

        // Fetch the trip with bus and operator details
        const trip = await Trip.findOne({ tripId })
        .populate({
            path: 'busNo',  
            select: 'busNo operatorRegisteredId',
            populate: {
                path: 'operatorRegisteredId',  
                select: 'operatorRegisteredId'
            }
        });
   
       if (!trip) {
           return res.status(404).json({ message: 'Trip not found' });
       }
      
        if (String(trip.busNo.operatorRegisteredId._id) !== String(req.operator.operatorId)) {
            return res.status(403).json({ message: 'Forbidden: Operator ID mismatch' });
        }

        // Validate and assign systemEnteredId
        const csystemEnteredId = await validateAndAssignAdminOrOperator(req);

        await Trip.findOneAndUpdate(
            {tripId},
            {
                
                tripAvalability: 'cancel',
                bookingAvalability: 'not available',
                csystemEnteredId 
            },
            { new: true } // Return the updated document
        );

        // Find related bookings and send notifications (optional)
        const bookings = await Booking.find({ tripId: trip._id });
        bookings.forEach(async (booking) => {
            booking.bookingStatus = 'cancel';
            await booking.save();
               // Prepare the email message
               const msg = {
                to: booking.commuterEmail, 
                from: 'tharangijayamuthu@gmail.com', // Use a verified SendGrid sender email
                subject: 'Trip Cancelation',
                text: `Hello, Your booking (ID: ${booking.bookingReferenceNo}) trip has been canceled.`,
                html: `
                    <h1>Booking Cancelation</h1>
                    <p>Hello,</p>
                    <p>Your booking (ID: <strong>${booking.bookingReferenceNo}</strong>) trip has been canceled.</p>
                    <p>A refund is available shortly!</p>
                    <p>Thank you for choosing us!</p>
                `,
            };

            // Send email using SendGrid
            try {
                await sgMail.send(msg);
            } catch (error) {
                console.error('Error sending email to customer:', booking.commuterEmail, error);
            }
        });


        return res.status(200).json({
            message: 'Trip canceled successfully',
            affectedBookings: bookings.length,
            
        });

        next();
    } catch (error) {
        next(error); // Pass error to global error handler
    }
};


//get trips by start location end location and date
export const getTripsDetails = async (req, res, next) => {
    try{
        const {startLocation,endLocation,date} = req.params

        if (!startLocation || !endLocation || !date) {
            throw new AppError('Start Location, End Location and Date required', 422, 'ValidationError');
        }

        const formattedDate = new Date(date);

        // Ensure the date is in the correct format
        if (isNaN(formattedDate)) {
            return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
        }

        const normalizedStartLocation = startLocation.trim().toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
        const normalizedEndLocation = endLocation.trim().toLowerCase().replace(/^\w/, (c) => c.toUpperCase());


        const trips = await Trip.find({startLocation: normalizedStartLocation, endLocation:normalizedEndLocation, date: formattedDate }) .populate('busNo', 'busNo busName busType').populate('routeNo', ('routeNo totalDistanceIn_km')); 

        if (!trips || trips.length === 0) {
            return res.status(404).json({ message: 'No Trips found for the specified start location, end location and date.' });
        } else{

            trips.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
            
            res.status(200).json({
                message: `trips retrieved successfully.`,
                trips: trips.map(trip => {
                    const isLuxury = trip.busNo.busType === 'luxury' || trip.busNo.busType === 'semi luxury';
                    
                    return {
                        date: trip.date.toISOString().split('T')[0],
                        tripCode: trip.tripId,
                        routeName: `${trip.startLocation} --> ${trip.endLocation}`,
                        routeNo: trip.routeNo.routeNo,
                        busNo: trip.busNo.busNo,
                        busName: trip.busNo.busName,
                        busType: trip.busNo.busType,
                        startLocation: trip.startLocation,
                        endLocation: trip.endLocation,
                        startTime: trip.startTime,
                        endTime: trip.endTime,
                        totalDistanceIn_km: trip.routeNo.totalDistanceIn_km,
                        totalTravellingTime: trip.totalTravellingTime,
                        
                        // Conditional Fee Field (Placed in the middle here)
                        ...(isLuxury 
                            ? { feePerSeatInLKR: trip.feePerSeatInLKR }
                            : { convinenceFeePerSeatInLKR: trip.feePerSeatInLKR }
                        ),
                        
                        totalNoOfSeats: trip.totalNoOfSeats,
                        tripAvailability: trip.tripAvalability,
                        bookingAvalability: trip.bookingAvalability,
                        totalAvailableSeats: trip.availableSeats?.length || 0,
                        stoppedStations: trip.stoppedStations.map(station => ({
                            name: station.name,
                            time: station.time
                        }))
                    };
                })
            });
            
        }
        next()

    } catch(error){
        next(error); // Pass error to the global error handler
    }
}


//get seat details bu trpId
export const getseatsDetailsById = async (req, res, next) => {
    try{
        const {tripId} = req.params

        if (!tripId ) {
            throw new AppError('Trip ID/Code required', 422, 'ValidationError');
        }


        const trips = await Trip.findOne({tripId}) .populate('busNo', 'busNo busName busType').populate('routeNo', ('routeNo')); 

        if (!trips || trips.length === 0) {
            return res.status(404).json({ message: 'No Trips found for this specific Id.' });
        } else{
            
            res.status(200).json({
                message: `seat details of ${tripId} retrieved successfully.`,
                
                date : trips.date.toISOString().split('T')[0],
                tripCode: trips.tripId,
                route:`${trips.routeNo.routeNo} -${trips.startLocation} --> ${trips.endLocation}`,
                busName: trips.busNo.busName,
                busType: trips.busNo.busType,
                totalNoOfSeats: trips.totalNoOfSeats,
                bookedSeats: trips.bookedSeats,
                notProvidedSeats: trips.notProvidedSeats,
                AvailableSeats: trips.availableSeats, 
                feePerSeatInLKR: trips.feePerSeatInLKR,
                tripAvailability: trips.tripAvalability,
                bookingAvalability: trips.bookingAvalability,
                        
            });
        }
        next()

    } catch(error){
        next(error); // Pass error to the global error handler
    }
}





