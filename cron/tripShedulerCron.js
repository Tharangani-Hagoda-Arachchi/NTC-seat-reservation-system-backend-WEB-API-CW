import cron from 'node-cron'
import Trip from '../models/tripModel.js';
import moment from 'moment-timezone';


export const bookingAvalabilityCheckingJob = () => {
    // Schedule the cron job with Sri Lanka time zone
cron.schedule('* * * * *', async () => {

    const nowSLT = moment().tz("Asia/Colombo").format('YYYY-MM-DD HH:mm:ss');
    console.log('Cron job running to check trip booking availability...', nowSLT);
   
    try {
        const now = moment().tz("Asia/Colombo").toDate();
        const trips = await Trip.find({ bookingAvalability: 'available' });

        trips.forEach(async (trips) => {
            // Convert trip's stored UTC date to Sri Lankan time
            // Convert trip's stored UTC date to Sri Lankan time
            const tripDate = moment.utc(trips.date).tz("Asia/Colombo").toDate();

            // Split startTime (e.g., '15:30') to get hours and minutes
            const [hours, minutes] = trips.startTime.split(':');
            tripDate.setHours(parseInt(hours, 10));
            tripDate.setMinutes(parseInt(minutes, 10));

            // Calculate 30 minutes before the trip's start time
            const thirtyMinutesBefore = new Date(tripDate.getTime() - 30 * 60 * 1000);

            if (now >= thirtyMinutesBefore ) {
                trips.bookingAvalability = 'not available';
                await trips.save();
                console.log(`Booking closed for Trip ID: ${trips.tripId}`);
            }
        });
    } catch (error) {
        console.error('Error in trip scheduler cron job:', error.message);
    }
}, {
    scheduled: true,
    timezone: "Asia/Colombo"
});

   
};

