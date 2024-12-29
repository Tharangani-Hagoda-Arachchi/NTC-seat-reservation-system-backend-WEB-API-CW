export function calculateSeatAvailability(totalNoOfSeats, notProvidedSeats=[], bookedSeats=[]) {
    // Generate seat identifiers (e.g., 1 to totalSeats as strings: 1, 2, ...)
    const allSeats = Array.from({ length: totalNoOfSeats }, (_, i) => (i + 1));

    // Filter available seats (those not in bookedSeats or notProvidedSeats)
    const availableSeats = allSeats.filter(
        (seat) => !notProvidedSeats.includes(seat) && !bookedSeats.includes(seat)
    );

    // Determine booking availability status
    const bookingAvalability = availableSeats.length === 0 ? 'sold out' : 'available';

    return {
        availableSeats: availableSeats, // Return the actual available seats (array)
        bookingAvalability,             // "sold out" if no seats are available
    };
}

// Apply hooks to the schema
export default function applyTripHooks(tripSchema) {
    // Hook for pre insertMany
    tripSchema.pre('insertMany', async function (next, docs) {
        docs.forEach(doc => {
            const { availableSeats, bookingAvalability } = calculateSeatAvailability(
                doc.totalNoOfSeats,
                doc.notProvidedSeats,
                doc.bookedSeats
            );
            doc.availableSeats = availableSeats; // Update availableSeats with the actual array
            doc.bookingAvalability = bookingAvalability; // Set booking availability
        });
        next();
    });

    // Hook for pre findOneAndUpdate
    tripSchema.pre('findOneAndUpdate', async function (next) {
        const update = this.getUpdate();

        if (update.bookedSeats || update.notProvidedSeats) {
            const docToUpdate = await this.model.findOne(this.getQuery());

            const { availableSeats, bookingAvalability } = calculateSeatAvailability(
                docToUpdate.totalNoOfSeats,
                update.notProvidedSeats || docToUpdate.notProvidedSeats,
                update.bookedSeats || docToUpdate.bookedSeats
            );

            this.set({
                availableSeats,          // Update availableSeats with the actual array
                bookingAvalability,      // Update booking availability
            });
        }

        next();
    });
}



