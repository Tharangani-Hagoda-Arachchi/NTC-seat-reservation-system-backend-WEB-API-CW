import cron from 'node-cron';
import moment from 'moment-timezone';
import Booking from '../models/bookingModel.js';
import Trip from '../models/tripModel.js';
import { calculateSeatAvailability } from '../hooks/tripHooks.js'; // Adjust path if needed

// Define the cron job
export const startBookingCleanupJob = () => {
    cron.schedule('* * * * *', async () => { // Runs every minute
        try {
            const nowSLT = moment().tz("Asia/Colombo").format('YYYY-MM-DD HH:mm:ss');
            console.log('Running booking cleanup job...',nowSLT);

            const expiredBookings = await Booking.find({
                bookingStatus: 'pending',
                date: { $lte: new Date(Date.now() - 10 * 60 * 1000) } // 10 minutes ago
            });

            for (const booking of expiredBookings) {
                const trip = await Trip.findById(booking.tripId);

                if (trip) {
                    // Restore seats
                    trip.bookedSeats = trip.bookedSeats.filter(seat => !booking.bookingSeatNo.includes(seat));
                    trip.availableSeats.push(...booking.bookingSeatNo);

                    // Recalculate seat availability
                    const { availableSeats, bookingAvalability } = calculateSeatAvailability(
                        trip.totalNoOfSeats,
                        trip.notProvidedSeats,
                        trip.bookedSeats
                    );

                    trip.availableSeats = availableSeats;
                    trip.bookingAvalability = bookingAvalability;

                    await trip.save();
                }

                await Booking.findByIdAndDelete(booking._id);
                console.log(`Expired booking ${booking._id} has been deleted.`);
            }
        } catch (error) {
            console.error('Error in booking cleanup job:', error);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Colombo"
    });
};
