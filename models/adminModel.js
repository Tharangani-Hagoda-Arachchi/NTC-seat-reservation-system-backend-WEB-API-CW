import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import Joi from 'joi';


// Define the User Schema
const adminSchema = new mongoose.Schema({
    adminId: {
        type: String,
        unique: true
    },

    adminName: {
        type: String,
        required: true,
        trim: true
    },
    
    adminEmail: {
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
    adminPassword: {
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

adminSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            //password vlidation 
            const { error } = passwordSchema.validate(this.adminPassword);
            if (error) {
                return next(new Error(error.details[0].message)); // Return validation error if password doesn't meet requirements
            }
            
            //hash password
            this.adminPassword = await bcrypt.hash(this.adminPassword, 10);

            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});



// Create the User model
const Admin = mongoose.model('Admin',adminSchema);

export default Admin;
