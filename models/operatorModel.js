import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import Joi from 'joi';


// Define the operator Schema
const operatorSchema = new mongoose.Schema({
    operatorRegisteredId: {
        type: String,
        unique: true
    },

    operatorName: {
        type: String,
        required: true,
        trim: true
    },
    
    operatorEmail: {
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
    operatorPassword: {
        type: String,
        required: true,       
    },
    operatorPhoneNo: {
        type: Number,
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

operatorSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            //password vlidation 
            const { error } = passwordSchema.validate(this.operatorPassword);
            if (error) {
                return next(new Error(error.details[0].message)); // Return validation error if password doesn't meet requirements
            }
            
            //hash password
            this.operatorPassword = await bcrypt.hash(this.operatorPassword, 10);

            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});



// Create the User model
const Operator = mongoose.model('Operator',operatorSchema);

export default Operator;
