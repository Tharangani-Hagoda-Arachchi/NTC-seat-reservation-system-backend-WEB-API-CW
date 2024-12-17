import mongoose from "mongoose";
import userSequence from "./sequenceModel.js";
import Joi from 'joi';
import bcrypt from 'bcrypt';

// Define the User Schema
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },
    
    email: {
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
    password: {
        type: String,
        required: true,
       
        
    },
    role: {
        type: String,
        enum: ['operator', 'admin', 'commuter'], 
        default: 'user'
    }
}, );

//password validation schema
const passwordSchema = Joi.string()
    .pattern(new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/))
    .required()
    .messages({
        'string.pattern.base': 'Password must include uppercase, lowercase, number, special character, and be at least 6 characters long',
    });

userSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const sequence = await userSequence.findOneAndUpdate(
                { name: 'userId' },
                { $inc: { value: 1 } },
                { new: true, upsert: true } // Create if it doesn't exist
            );

            const formattedId = String(sequence.value).padStart(5, '0'); // Pads with leading zeros to 5 digits
            this.userId = `USER-${formattedId}`;

            //password vlidation 
            const { error } = passwordSchema.validate(this.password);
            if (error) {
                return next(new Error(error.details[0].message)); // Return validation error if password doesn't meet requirements
            }
            
            //hash password
            this.password = await bcrypt.hash(this.password, 10);

            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

// Create the User model
const User = mongoose.model('User', userSchema);

export default User;
