import RefreshToken from '../models/refreshTokenModel.js';
import { generateRefreshToken } from '../utils/authentication.js';
import { AppError } from '../utils/errorHandler.js'; 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Commuter from '../models/commuterModel.js';
import Admin from '../models/adminModel.js';
import Operator from '../models/operatorModel.js';
import BlacklistToken from '../models/blacklisttokenModel.js';
dotenv.config();


const jwtSecret = process.env.JWT_SECRET;
const refreshTokenSecret = process.env.REFRESH_SECRET;

// commuter signup
export const commuterSignup = async (req, res, next) => {
    try{
        const { commuterName, commuterEmail,commuterPassword } = req.body

        // check email is already exists
        const existingCommuter = await Commuter.findOne({ commuterEmail });
        if (existingCommuter) {
            return res.status(400).json({ message: 'Email is already registered' });
        }


        // create nwe Commuter
        const newCommuter = new Commuter({
            commuterName,
            commuterEmail,
            commuterPassword
        });

        await newCommuter.save();

        res.status(201).json({ message: 'Signup successful' });
        next()


    } catch(error){
        next(error); // Pass error to the global error handler
    }
};


//Admin Login
export const adminLogin = async (req, res, next) => {
    try{
        const { adminEmail,adminPassword,adminId} = req.body
        
        if (!adminEmail || !adminPassword || !adminId) {
            throw new AppError('Email password and ID are required', 422, 'ValidationError');
        }

        const admin = await Admin.findOne({adminId})

        if (!admin){
            throw new AppError('Not Eligible for Admin logins', 401, 'AuthenticationError');
        }
        const matchEmail = await Admin.findOne({adminEmail})

        if (!matchEmail){
            throw new AppError('Email or password Invalid', 401, 'AuthenticationError');
        }

        const passwordMatch = await bcrypt.compare(adminPassword, admin.adminPassword)

        if (!passwordMatch) {
            throw new AppError('Email or Password invalid', 401, 'AuthenticationError');
        }

        //create jwt token
        const accessToken = jwt.sign({adminId: admin._id}, jwtSecret, { subject: 'AccessAPI', expiresIn: '15m'})

        // create refresh token
        const refreshToken = await generateRefreshToken(admin,'admin');

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true }); // HTTP-only cookie for refresh token
       
        res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken,
            refreshToken
        });
        next()
        

    } catch(error){
        next(error)
    }
};

//operator login
export const operatorLogin = async (req, res, next) => {
    try{
        const { operatorEmail,operatorPassword,operatorRegisteredId} = req.body
        
        if (!operatorEmail || !operatorPassword || !operatorRegisteredId) {
            throw new AppError('Email password and registered ID are required', 422, 'ValidationError');
        }

        const operator = await Operator.findOne({operatorRegisteredId})

        if (!operator){
            throw new AppError('Not Eligible for Operator logins', 401, 'AuthenticationError');
        }
        const matchEmail = await Operator.findOne({operatorEmail})

        if (!matchEmail){
            throw new AppError('Email or password Invalid', 401, 'AuthenticationError');
        }

        const passwordMatch = await bcrypt.compare(operatorPassword, operator.operatorPassword)

        if (!passwordMatch) {
            throw new AppError('Email or Password invalid', 401, 'AuthenticationError');
        }

        //create jwt token
        const accessToken = jwt.sign({operatorId: operator._id}, jwtSecret, { subject: 'AccessAPI', expiresIn: '15m'})

        // create refresh token
        const refreshToken = await generateRefreshToken(operator,'operator');

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true }); // HTTP-only cookie for refresh token
       
        res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken,
            refreshToken
        });

        next()
        

    } catch(error){
        next(error)
    }
};


//commuter login
export const commuterLogin = async (req, res, next) => {
    try{
        const { commuterEmail,commuterPassword} = req.body
        
        if (!commuterEmail || !commuterPassword) {
            throw new AppError('Email password are required', 422, 'ValidationError');
        }

        const commuter = await Commuter.findOne({commuterEmail})

        if (!commuter){
            throw new AppError('Email password are invalid', 401, 'AuthenticationError');
        }

        const passwordMatch = await bcrypt.compare(commuterPassword, commuter.commuterPassword)

        if (!passwordMatch) {
            throw new AppError('Email or Password invalid', 401, 'AuthenticationError');
        }

        //create jwt token
        const accessToken = jwt.sign({commuterId: commuter._id}, jwtSecret, { subject: 'AccessAPI', expiresIn: '15m'})

        // create refresh token
        const refreshToken = await generateRefreshToken(commuter,'commuter');

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true }); // HTTP-only cookie for refresh token
       
        res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken,
            refreshToken
        });

        next()
        
        

    } catch(error){
        next(error)
    }
}




// Create refresh token
export const refreshTokenGeneration = async (req, res, next) => {
    try {
        const requestRefreshToken = req.cookies.refreshToken;

        if (!requestRefreshToken) {
            throw new AppError('Refresh Token not found', 400, 'ValidationError');
        }

        // Decode the refresh token
        const decodeRefreshToken = jwt.verify(requestRefreshToken, refreshTokenSecret);

        if (!decodeRefreshToken || (!decodeRefreshToken.adminId && !decodeRefreshToken.operatorId && !decodeRefreshToken.commuterId)) {
            throw new AppError('Invalid Refresh Token payload', 400, 'ValidationError');
        }

        // Determine user type and userId dynamically
        let userId, userType, entityModel;

        if (decodeRefreshToken.adminId) {
            userId = decodeRefreshToken.adminId;
            userType = 'admin';
            entityModel = Admin; // Assuming Admin is the model for admin users
        } else if (decodeRefreshToken.operatorId) {
            userId = decodeRefreshToken.operatorId;
            userType = 'operator';
            entityModel = Operator; // Assuming Operator is the model for operator users
        } else if (decodeRefreshToken.commuterId) {
            userId = decodeRefreshToken.commuterId;
            userType = 'commuter';
            entityModel = Commuter; // Assuming Commuter is the model for commuter users
        }

        // Fetch the entity from the database
        const entity = await entityModel.findOne({ _id: userId });
        if (!entity) {
            throw new AppError(`${userType} not found`, 404, 'NotFoundError');
        }

        // Find the refresh token in the database based on userId and type
        const userRefreshToken = await RefreshToken.findOne({
            token: requestRefreshToken,
            [`${userType}Id`]: userId,
        });

        if (!userRefreshToken) {
            throw new AppError('Refresh Token not found.', 401, 'AuthenticationError');
        }

        // Delete all previous refresh tokens for this user
        await RefreshToken.deleteMany({ [`${userType}Id`]: userId });

        // Generate a new access token
        const accessToken = jwt.sign({ [`${userType}Id`]: entity._id }, jwtSecret, {
            subject: 'AccessAPI',
            expiresIn: '15m',
        });

        // Generate a new refresh token using the `generateRefreshToken` function
        const refreshToken = await generateRefreshToken(entity, userType);

        // Set the new refresh token in an HTTP-only cookie
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

        // Respond with the new access token
        res.status(200).json({
            success: true,
            accessToken,
        });

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
            throw new AppError('Refresh Token invalid or expired', 401, 'AuthenticationError');
        }
        next(error);
    }
};


//logout
export const logout = async (req, res, next) => {
    try {
        const requestRefreshToken = req.cookies.refreshToken;

        if (!requestRefreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        // Verify the refresh token
        jwt.verify(requestRefreshToken, refreshTokenSecret, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            // Check if the refresh token is already blacklisted
            const tokenExists = await BlacklistToken.findOne({ token: requestRefreshToken });
            if (tokenExists) {
                return res.status(400).json({ message: 'Token already invalidated' });
            }

            // Save the refresh token to the blacklist collection
            const newBlacklistToken = new BlacklistToken({
                token: requestRefreshToken,
                expiresAt: new Date(Date.now() + (60 * 60 * 24 * 7 * 1000)) 
            });

            await newBlacklistToken.save();

            res.status(200).json({ message: 'Logged out successfully' });
            next()
        });
    } catch (error) {
        next(error)
    }
};