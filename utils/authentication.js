import User from '../models/commuterModel.js'
import RefreshToken from '../models/refreshTokenModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const jwtSecret = process.env.JWT_SECRET;
const refreshTokenSecret = process.env.REFRESH_SECRET;

export const ensureAuthentication = async(req,res,next) => {
    try{
        const accessToken = req.headers.authorization

        if(!accessToken){
            return res.status(401).json({ message: 'Access token is not found'})      
        }

        const decodeAccesstoken = jwt.verify(accessToken,jwtSecret)
        req.user ={ userId: decodeAccesstoken.userId}

        next()

    }catch(error){
        next(error)       
    }

};

export function authorize(roles =[]){
    return async function (req,res,next) {
        try{
            const user = await User.findOne({userId: req.user.userId})

            if (!user || !roles.includes(user.role)){
                return res.status(403).json({message: 'Access Denied'})
            }

            next()
            
        }catch(error){
            next(error)
        }    
    }
};

/// Create refresh token for admin operator commuter
export const generateRefreshToken = async (entity, type) => {
    try {
        const validTypes = ['admin', 'operator', 'commuter'];
        if (!validTypes.includes(type)) {
            throw new Error('Invalid type. Must be "admin", "operator", or "commuter".');
        }

       // Generate payload dynamically using MongoDB _id
        const payload = { [`${type}Id`]: entity._id };
        const entityId = entity._id;

        // Create refresh token
        const token = jwt.sign(payload, refreshTokenSecret, { 
            subject: 'AccessAPI', 
            expiresIn: '1w' 
        });

        // Save refresh token in the database
        const refreshToken = new RefreshToken({
            [`${type}Id`]: entityId, // Dynamic key assignment using _id
            token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
        });

        await refreshToken.save();
        return token; // Return the refresh token

    } catch (error) {
        throw error;    
    }
};
