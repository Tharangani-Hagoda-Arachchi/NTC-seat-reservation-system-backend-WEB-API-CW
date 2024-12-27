// function to calculate available seats and booking availability
function calculateSeatAvailability(totalSeats, notProvidedSeats = [], bookedSeats = []) {
    const allSeats = Array.from({ length: totalSeats }, (_, i) => i + 1);

    const availableSeats = allSeats.filter(seat => 
        !notProvidedSeats.includes(seat) && !bookedSeats.includes(seat)
    );

    const bookingAvalability = availableSeats.length === 0 ? 'sold out' : 'available';

    return { availableSeats, bookingAvalability };
}


// Apply hooks to the schema
export default function applyTripHooks(tripSchema) {
    //hook for pre insertmany
    tripSchema.pre('insertMany', async function (next, docs) {
        docs.forEach(doc => {
            const { availableSeats, bookingAvalability } = calculateSeatAvailability(
                this.totalNoOfSeats,
                this.notProvidedSeats,
                this.bookedSeats
        );
        this.availableSeats = availableSeats;
        this.bookingAvalability = bookingAvalability;
        next();
    });

    //hook forfind one and update
    tripSchema.pre('findOneAndUpdate', async function (next) {
        const update = this.getUpdate();

        if (update.bookedSeats || update.notProvidedSeats) {
            const docToUpdate = await this.model.findOne(this.getQuery());

            const { availableSeats, bookingAvalability } = calculateSeatAvailability(
                docToUpdate.totalNoOfSeats,
                update.notProvidedSeats || docToUpdate.notProvidedSeats,
                update.bookedSeats || docToUpdate.bookedSeats
            );

            update.availableSeats = availableSeats;
            update.bookingAvalability = bookingAvalability;
        }

        next();
    });
});
}
