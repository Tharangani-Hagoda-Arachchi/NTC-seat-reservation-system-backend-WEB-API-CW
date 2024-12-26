import Joi from 'joi';
import {AppError} from '../utils/errorHandler.js'

const stationSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.base': 'Station name must be a string.',
        'any.required': 'Station name is required.'
    }),
    time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required().messages({
        'string.pattern.base': 'Time must be in the format HH:mm (24-hour).',
        'any.required': 'Time is required for the station.'
    })
});

const tripValidationSchema = Joi.object({
    startLocation: Joi.string().required().messages({
        'string.base': 'Start location must be a string.',
        'any.required': 'Start location is required.'
    }),
    endLocation: Joi.string().required().messages({
        'string.base': 'End location must be a string.',
        'any.required': 'End location is required.'
    }),
    date: Joi.date().messages({
        'date.base': 'Date must be a valid date',
    }),
    startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required().messages({
        'string.pattern.base': 'Time must be in the format HH:mm (24-hour).',
        'any.required': ' Start Time is required.'
    }),
    endTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required().messages({
        'string.pattern.base': 'Time must be in the format HH:mm (24-hour).',
        'any.required': ' End Time is required.'
    }),
    totalTravellingTime: Joi.string().required().messages({
        'string.base': 'Total travelling time must be a string.',
        'any.required': 'Total travelling time is required.'
    }),
    busNo: Joi.string().required().messages({
        'string.base': 'Bus number must be a string.',
        'any.required': 'Bus number is required.'
    }),
    routeNo: Joi.string().required().messages({
        'string.base': 'Route number must be a string.',
        'any.required': 'Route number is required.'
    }),
    stoppedStations: Joi.array().items(stationSchema).optional().messages({
        'array.base': 'Stopped stations must be an array.',
        'array.items': 'Each stopped station must be a valid station object.',
    })
}).messages({
    'object.base': 'Trip must be an object with valid fields.',
    'any.required': 'This field is required.'
});

//middleware function to validate signup
const validateTrip = (req, res, next) => {
   
    const { error } = tripValidationSchema.validate(req.body, { abortEarly: false });
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

export default validateTrip
