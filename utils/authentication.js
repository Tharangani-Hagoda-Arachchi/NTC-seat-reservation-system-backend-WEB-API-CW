import User from '../models/userModel.js'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const jwtSecret = process.env.JWT_SECRET

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
        
        //return res.status(401).json({ message: 'Access Token invalid or expire'});
        next(error)
        
    }

}

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
}