import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  bookingReferenceNo: {
    type: String,
    unique: true,
    required: true,
  },
  bookingSeatNo: {
    type: [Number],
    required: true,
  },
  totalFee: {
    type: Number,
    required: true,
  },
  commuterName: {
    type: String,
    required: true,
  },
  commuterPhoneNo: {
    type: Number,
    required: true,
  },
  commuterEmail: {
    type: String,
    required: false,
    match: /.+\@.+\..+/
  },
  date: {
    type: Date,
    required: true,
  },
  bordingPlace: {
    type: String,
    required: true,
  },
  destinationPlace: {
    type: String,
    required: true,
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  commuterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Commuter',
    required: true,
  },
  
  payment: {
    paymentRefNo: {
      type: String,
      unique: true,
      sparse: true,
      required: false,
    },
    paymentAmount: {
      type: Number,
      required: false,
    },
    paymentDate: {
      type: Date,
      required: false,
    }
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirm', 'cancel'],
    default: 'pending',  // Default status is 'pending'
  }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking
