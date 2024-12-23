import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
    permitNo: { 
        type: String, 
        required: true, 
        unique: true 
    },
    busNo: { 
        type: String, 
        required: true, 
        unique: true 
    },
    busName: { 
        type: String, 
        required: true 
    },
    busType: { 
        type: String, 
        enum: [ 'Luxury','Semi Luxury','Normal'], 
        required: true 
    },
    driverRegisteredCode: {
        type: String, 
        required: true 
    },
    conductorRegisteredCode: { 
        type: String, 
        required: true 
    },
    routeNo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Route', 
        required: true 
    }, 
    systemEnteredAdminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: false
    },
    systemEnteredOperatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Operator',
        required: false
    }  
},
{
    timestamps: true // Adds createdAt and updatedAt timestamps
}
);

// Ensure unique index for routeId and busNo (if one bus should have one route)
busSchema.index({ routeId: 1, busNo: 1 }, { unique: true });
// Ensure either operatorId or adminId or commuterId is provided, but not both
busSchema.pre('save', function (next) {
    if (!this.systemEnteredAdminId && !this.systemEnteredOperatorId ) {
        return next(new Error('Either operaterId or adminId  must be provided.'));
    }
    if (this.systemEnteredAdminId && this.systemEnteredOperatorId ) {
        return next(new Error(' operatorId adminId cannot be provided at the same time.'));
    }
    next();
  });
  
const Bus = mongoose.model('Bus', busSchema);

export default Bus;
