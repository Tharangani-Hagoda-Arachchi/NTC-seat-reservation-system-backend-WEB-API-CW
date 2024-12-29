import Joi from "joi";
import { AppError } from "../utils/errorHandler.js";

const bookingValidationSchema = Joi.object({
  bookingSeatNo: Joi.array()
    .items(Joi.number().integer().min(1))
    .required()
    .messages({
      'array.base': 'Booking seat numbers must be an array of numbers.',
      'array.includesRequiredUnknowns': 'Each seat number must be a positive integer.',
      'any.required': 'Booking seat numbers are required.',
    }),
  commuterName: Joi.string()
    .min(3)
    .required()
    .messages({
      'string.base': 'Commuter name must be a string.',
      'string.min': 'Commuter name must not be empty.',
      'any.required': 'Commuter name is required.',
    }),
  commuterPhoneNo: Joi.number()
 // Basic phone number validation (you can adjust the pattern)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be between 10 to 15 digits.',
      'any.required': 'Phone number is required.',
    }),
  commuterEmail: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address.',
      'any.required': 'Email is required.',
    }),

  bordingPlace: Joi.string()
    .min(3)
    .required()
    .messages({
      'string.base': 'Boarding place must be a string.',
      'any.required': 'Boarding place is required.',
    }),
  destinationPlace: Joi.string()
    .min(3)
    .required()
    .messages({
      'string.base': 'Destination place must be a string.',
      'any.required': 'Destination place is required.',
    }),

});

//middleware function to validate bookings
const validateBookings = async(req, res, next) => {
   
    const { error } = bookingValidationSchema.validate(req.body, { abortEarly: false });
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

export default validateBookings;


