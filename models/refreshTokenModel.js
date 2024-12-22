import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  operatorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Operator', 
    required: false 
  },
  adminId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin', 
    required: false 
  },
  commuterId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Commuter', 
    required: false 
  },
  token: { 
    type: String, 
    required: true 
  },
  expiresAt: { 
    type: Date, 
    required: true 
  }
}, {
timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Ensure either operatorId or adminId or commuterId is provided, but not both
refreshTokenSchema.pre('save', function (next) {
  if (!this.operatorId && !this.adminId && !this.commuterId) {
      return next(new Error('Either operaterId or adminId or commuterId must be provided.'));
  }
  if (this.operatorId && this.adminId && this.commuterId) {
      return next(new Error(' operatorId, commuterId and adminId cannot be provided at the same time.'));
  }
  next();
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;


