import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Use the custom userId
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;


