import User from '../models/userModel.js';
import { AppError } from '../utils/errorHandler.js'; 

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const jwtSecret = process.env.JWT_SECRET

// signup
export const signup = async (req, res, next) => {
    try{
        const { name, email,password,role } = req.body

        // check email is already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // create nwe user
        const newUser = new User({
            name,
            email,
            password,
            role: role || 'commuter'
        });

        await newUser.save();

        res.status(201).json({ message: 'Signup successful' });


    } catch(error){
        next(error); // Pass error to the global error handler
    }
}

//Login
export const login = async (req, res, next) => {
    try{
        const { email,password} = req.body
        
        if (!email || !password) {
            throw new AppError('Email and password are required', 422, 'ValidationError');
        }

        const user = await User.findOne({email})

        if (!user){
            throw new AppError('Email or Password invalid', 401, 'AuthenticationError');
        
        }
        
        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            throw new AppError('Email or Password invalid', 401, 'AuthenticationError');
        }
        res.status(200).json({success: true,message: 'Login successful'});


    } catch(error){
        next(error)
    }
}

