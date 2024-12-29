import Booking from '../models/bookingModel.js';
import Trip from '../models/tripModel.js';
import crypto from 'crypto'
import moment from 'moment-timezone';
import { calculateSeatAvailability } from '../hooks/tripHooks.js';


//generate unique booking reference No
const generateOrderRefNo = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    const randomString = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 random hex chars
    return `ORD-${date}-${randomString}`;
};

const generatePaymentRefNo = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    const randomString = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 random hex chars
    return `PAYMENT-${date}-${randomString}`;
};


export const bookingSeats = async (req, res, next) => {
    try{
        const { tripId } = req.params;
        const { bookingSeatNo, commuterName, commuterPhoneNo, commuterEmail, bordingPlace, destinationPlace } = req.body

        const trip = await Trip.findOne({ tripId });
        if (!trip) {
            return res.status(409).json({ message: 'Invalid Trip No' });
        }

        if (trip.tripAvalability !== 'available') {
            return res.status(400).json({ message: 'This trip is cancled' });
        }

        if (trip.bookingAvalability !== 'available') {
            return res.status(400).json({ message: 'This trip is no longer available for booking' });
        }

        // Validate requested seats
        const unavailableSeats = bookingSeatNo.filter(
            seat => !trip.availableSeats.includes(seat) || trip.notProvidedSeats.includes(seat)
        );

        if (unavailableSeats.length > 0) {
            return res.status(400).json({
                message: 'Some selected seats are not available or not provided',
                unavailableSeats
            });
        }

        const totalFee = trip.feePerSeatInLKR * bookingSeats.length();

        // create nwe booking
        const booking = new Booking({
            bookingReferenceNo: generateOrderRefNo(),
            bookingSeatNo, 
            totalFee,
            commuterName,
            commuterPhoneNo,
            commuterEmail,
            date: moment.tz("Asia/Colombo").toDate(),
            bordingPlace,
            destinationPlace: destinationPlace,
            tripId: trip._id,
            commuterId: req.commuter.commuterId,
            bookingStatus: 'pending',  // Default booking status is 'pending'
            payment: { paymentRefNo: generatePaymentRefNo() } 
          });

        await booking.save();
        
          // Update Trip: Remove seats from availableSeats, add to bookedSeats
          trip.bookedSeats.push(...bookingSeatNo);
          trip.availableSeats = trip.availableSeats.filter(seat => !bookingSeatNo.includes(seat));
  
          // Calculate seat availability using the utility function
          const { availableSeats, bookingAvalability } = calculateSeatAvailability(
              trip.totalNoOfSeats,
              trip.notProvidedSeats,
              trip.bookedSeats
          );
  
          // Update trip availability status
          trip.availableSeats = availableSeats;
          trip.bookingAvalability= bookingAvalability ;
  
          await trip.save();
            
        res.status(201).json({
            message: 'Booking successful, please proceed with payment. If you not complete within 10 min automaticaly booking will be cancel',
            bookingRefNo: booking.bookingReferenceNo,
            bookingSeatNo,
            totalFee

        });

        next()
    

    } catch(error){
        next(error); // Pass error to the global error handler
    }
    
};
export const bookingPayment = async (req, res, next) => {
    try{
        const { bookingReferenceNo } = req.params;
        const { paymentAmount } = req.body

        const booking = await Booking.findOne({ bookingReferenceNo });
        if (!booking) {
            return res.status(409).json({ message: 'booking not found or automaticaly canceled excede payment time limit' });
        }

        if (booking.bookingStatus = 'confirm') {
            return res.status(409).json({ message: 'already payment is done' });
        }

        if (typeof paymentAmount !== 'number' || isNaN(paymentAmount) || paymentAmount <= 0) {
            return res.status(400).json({ message: 'Payment amount must be a positive number' });
        }

        if (paymentAmount != booking.totalFee) {
            return res.status(409).json({ message: 'total payment is required' });
        }

        const updatedPayment = await Booking.findOneAndUpdate(
            { bookingReferenceNo },
            { 
                payment: { paymentRefNo: generatePaymentRefNo() ,paymentAmount: paymentAmount, paymentDate: moment.tz("Asia/Colombo").toDate(), } ,
                bookingStatus: 'confirm',
            }, 
            { new: true }
        );
            
        res.status(201).json({
            message: 'Payment successful and booking confirmed',
            bookingRefNo: booking.bookingReferenceNo,
            paymentRefNo: booking.paymentRefNo,
            bookingSeatNo:booking.bookingSeatNo,
            totalAmount: paymentAmount

        });

        next()
    

    } catch(error){
        next(error); // Pass error to the global error handler
    }
};

export const bookingCancel = async (req, res, next) => {
    try{
        const { bookingReferenceNo } = req.params;

        const booking = await Booking.findOne({ bookingReferenceNo });
        if (!booking) {
            return res.status(409).json({ message: 'booking not found ' });
        }

        // Update booking status to 'cancelled'
        booking.bookingStatus = 'cancel';
        await booking.save();

        // Get the booked seat numbers
        const bookedSeatsNo = booking.bookingSeatNo; 

        // Find the trip associated with the booking
        const trip = await Trip.findById(booking.tripId);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        
        // Add the booked seats back to availableSeats
        trip.availableSeats = [...new Set([...trip.availableSeats, ...bookedSeatsNo])];

        // Remove the cancelled seats from bookedSeats 
        trip.bookedSeats = trip.bookedSeats.filter(
            (seat) => !bookedSeatsNo.includes(seat)
        );
        
        /// Calculate seat availability using the utility function
        const { availableSeats, bookingAvalability } = calculateSeatAvailability(
            trip.totalNoOfSeats,
            trip.notProvidedSeats,
            trip.bookedSeats
        );

        // Update trip availability status
        trip.availableSeats = availableSeats;
        trip.bookingAvalability= bookingAvalability ;

        await trip.save();
        
            
        res.status(200).json({ message: 'Booking cancelled and seats updated successfully' });

        next()
    

    } catch(error){
        next(error); // Pass error to the global error handler
    }
};


