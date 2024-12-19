import User from '../models/userModel.js';
import RefreshToken from '../models/refreshTokenModel.js';
import { generateRefreshToken } from '../utils/authentication.js';
import { AppError } from '../utils/errorHandler.js'; 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();




const jwtSecret = process.env.JWT_SECRET;
const refreshTokenSecret = process.env.REFRESH_SECRET;

// signup
export const signup = async (req, res, next) => {
    try{
        const { name, email,password,role } = req.body

        // check email is already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        //check roles are only commuter or operator
        const allowedRoles = new Set(['commuter', 'operator']);
        if (!allowedRoles.has(role.toLowerCase())) {
            return res.status(400).json({ 
                message: `Invalid role: '${role}'. Please choose a valid role: ${Array.from(allowedRoles).join(', ')}.` 
            });
        }

        // create nwe user
        const newUser = new User({
            name,
            email,
            password,
            role: role 
        });

        await newUser.save();

        res.status(201).json({ message: 'Signup successful' });


    } catch(error){
        next(error); // Pass error to the global error handler
    }
};

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

        //create jwt token
        const accessToken = jwt.sign({userId: user.userId}, jwtSecret, { subject: 'AccessAPI', expiresIn: '1h'});
         
        // create refresh token
         const refreshToken = await generateRefreshToken(user);

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true }); // HTTP-only cookie for refresh token
        res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken,
            refreshToken
        });

    } catch(error){
        next(error)
    }
};

// create refresh token
export const refreshTokenGeneration = async (req, res, next) => {
    try{
        const requestRefreshToken = req.cookies.refreshToken;
        
        if (!requestRefreshToken) {
            throw new AppError('Refresh Token not found', 400, 'ValidationError');
        }

        const decodeRefreshToken =jwt.verify(requestRefreshToken,refreshTokenSecret);// decode refresh token

        if (!decodeRefreshToken || !decodeRefreshToken.userId) {
            throw new AppError('Invalid Refresh Token payload', 400, 'ValidationError');
        }
        
        const userRefreshToken = await RefreshToken.findOne({token:requestRefreshToken, userId: decodeRefreshToken.userId,});
        
        if (!userRefreshToken){
            throw new AppError('Refresh Token not found.', 401, 'AuthenticationError');       
        }
       
        await RefreshToken.deleteMany({userId:userRefreshToken.userId});// delete previosly stored refresh tokens
        
        // generate new acess token
        const accessToken = jwt.sign({userId: decodeRefreshToken.userId}, jwtSecret, { subject: 'AccessAPI', expiresIn: '30s'})

        // create refresh token
        const refreshToken = await generateRefreshToken(decodeRefreshToken);

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true }); // HTTP-only cookie for refresh token

        res.status(200).json({
            success: true,
            accessToken
        });

    } catch(error){
        if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError){
            throw new AppError('Refresh Token invalid or expired', 401, 'AuthenticationError');
        }
        next(error)
    }
};


