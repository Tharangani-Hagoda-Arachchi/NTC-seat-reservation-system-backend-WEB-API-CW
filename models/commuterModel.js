import mongoose from "mongoose";
import userSequence from "./sequenceModel.js";
import Joi from 'joi';
import bcrypt from 'bcrypt';

// Define the commuter Schema
const commuterSchema = new mongoose.Schema({
    commuterId: {
        type: String,
        unique: true
    },

    commuterName: {
        type: String,
        required: true,
        trim: true
    },
    
    commuterEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address'
        ]
    },
    commuterPassword: {
        type: String,
        required: true,
       
        
    }
}, );

//password validation schema
const passwordSchema = Joi.string()
    .pattern(new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/))
    .required()
    .messages({
        'string.pattern.base': 'Password must include uppercase, lowercase, number, special character, and be at least 6 characters long',
    });

commuterSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const sequence = await userSequence.findOneAndUpdate(
                { name: 'commuterId' },
                { $inc: { value: 1 } },
                { new: true, upsert: true } // Create if it doesn't exist
            );

            const formattedId = String(sequence.value).padStart(5, '0'); // Pads with leading zeros to 5 digits
            this.commuterId = `USER-${formattedId}`;

            //password vlidation 
            const { error } = passwordSchema.validate(this.commuterPassword);
            if (error) {
                return next(new Error(error.details[0].message)); // Return validation error if password doesn't meet requirements
            }
            
            //hash password
            this.commuterPassword = await bcrypt.hash(this.commuterPassword, 10);

            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

// Create the commuter model
const Commuter = mongoose.model('Commuter', commuterSchema);

export default Commuter;
