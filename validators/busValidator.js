import Joi from "joi";
import { AppError } from "../utils/errorHandler.js";

// Joi validation schema for Bus with custom messages
const busValidationSchema = Joi.object({
    permitNo: Joi.string().required().messages({
        'string.empty': 'Permit Number is required',
    }),

    busNo: Joi.string().required().messages({
        'string.empty': 'Bus Number is required',
    }),

    busName: Joi.string().required().messages({
        'string.empty': 'Bus Name is required',
    }),

    busType: Joi.string()
        .valid('Normal', 'Semi Luxury', 'Luxury')
        .required()
        .messages({
            'any.only': 'Bus Type must be one Normal, Semi Luxury, or Luxury',
            'string.empty': 'Bus Type is required',
    }),
    totalNoOfSeats: Joi.number().integer().min(1).max(60).required().messages({
        'number.base': 'Total number of seats must be a number.',
        'number.integer': 'Total number of seats must be an integer.',
        'number.min': 'Total number of seats must be at least 1.',
        'number.max': 'Total number of seats must be les than or equal to 60.',
        'any.required': 'Total number of seats is required.'
    }),
    
    driverRegisteredCode: Joi.string().required().messages({
        'string.empty': 'Driver Registered Code is required',
    }),

    conductorRegisteredCode: Joi.string().required().messages({
        'string.empty': 'Conductor Registered Code is required',
    }),

    routeNo: Joi.string().required().messages({
        'string.empty': 'Route No is required',
    }),

    operatorRegisteredId: Joi.string().required().messages({
        'string.empty': 'Operator Registerd Idis required',
    }),


});

//middleware function to validate add bus
const validateAddBus = async(req, res, next) => {
   
    const { error } = busValidationSchema.validate(req.body, { abortEarly: false });
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

export default validateAddBus;


