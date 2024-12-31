import mongoose from "mongoose";

const BlacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true, // Ensure no duplicate tokens
    },
    addedAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
    }
});

const BlacklistToken = mongoose.model('BlacklistToken', BlacklistTokenSchema);

export default BlacklistToken
