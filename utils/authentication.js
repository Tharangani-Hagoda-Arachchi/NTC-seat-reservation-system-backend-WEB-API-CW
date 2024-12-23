import User from '../models/commuterModel.js'
import RefreshToken from '../models/refreshTokenModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Admin from '../models/adminModel.js';
import Operator from '../models/operatorModel.js';
import Commuter from '../models/commuterModel.js';
dotenv.config();


const jwtSecret = process.env.JWT_SECRET;
const refreshTokenSecret = process.env.REFRESH_SECRET;

export const ensureAuthentication = async(req,res,next) => {
    try{
        const authHeader = req.headers.authorization

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({ message: 'Access token is not found'})      
        }
        const accessToken = authHeader.split(' ')[1]

        const decodeAccesstoken = jwt.verify(accessToken,jwtSecret)
        if (decodeAccesstoken.adminId) {
            req.admin = { adminId: decodeAccesstoken.adminId };
        } else if (decodeAccesstoken.operatorId) {
            req.operator = { operatorId: decodeAccesstoken.operatorId };
        } else if (decodeAccesstoken.commuterId) {
            req.commuter = { commuterId: decodeAccesstoken.commuterId };
        } else {
            return res.status(403).json({ message: 'Invalid token payload' });
        }
        next()
    }catch(error){
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired login again' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }       
        next(error);        
    }

};

export function authorize(roles =[]){
    return async function (req,res,next) {
        try{
            let entityType = null;

            if (req.admin && roles.includes('admin')) {
                entityType = await Admin.findById(req.admin.adminId);
            } else if (req.operator && roles.includes('operator')) {
                entityType = await Operator.findById(req.operator.operatorId);
            } else if (req.commuter && roles.includes('commuter')) {
                entityType = await Commuter.findById(req.commuter.commuterId);
            }

            if (!entityType) {
                return res.status(403).json({ message: 'Forbidden: Access Denied' });
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
