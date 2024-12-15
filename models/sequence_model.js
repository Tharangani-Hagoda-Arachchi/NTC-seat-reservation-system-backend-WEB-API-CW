import mongoose from "mongoose";

const userSequenceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: Number,
        required: true
    }
});

const userSequence = mongoose.model('userSequence', userSequenceSchema);

export default userSequence;