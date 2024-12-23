import Joi from 'joi';
import {AppError} from '../utils/errorHandler.js'

//use validation scema
const routeValidationSchema = Joi.object({
    routeNo: Joi.string().max(50).required().messages({
        'string.empty': 'Route Number is required',
        'string.max': 'Route Number cannot exceed 50 characters',
    }),
    startLocation: Joi.string().required().messages({
        'string.empty': 'Start location is required',
    }),
    endLocation: Joi.string().required().messages({
        'string.empty': 'End location is required',
    }),
    totalDistanceIn_km: Joi.number().required().messages({
        'number.empty': 'Total distance is required',
    }),
});

//middleware function to validate signup
const validateRoute = async (req, res, next) => {
   
    const { error } = routeValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map(err => err.message);
        return next(new AppError(
            'Validation failed',
            400,
            'ValidationError',
            errorMessages
        ));    
    }
   
    next();
};

export default validateRoute;