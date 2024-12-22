import Joi from 'joi';
import {AppError} from '../utils/errorHandler.js'

//use validation scema
const operatorValidationSchema = Joi.object({
    operatorRegisteredId: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Id is required',
        'string.min': 'Id must be at least 3 characters',
        'string.max': 'Id cannot exceed 50 characters',
    }),
    operatorName: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 3 characters',
        'string.max': 'Name cannot exceed 50 characters',
    }),
    operatorEmail: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'string.empty': 'Email is required',
    }),
    operatorPassword: Joi.string()
        .pattern(new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/))
        .required()
        .messages({
            'string.pattern.base': 'Password must include uppercase, lowercase, number, special character, and be at least 6 characters long',
            'string.empty': 'Password is required',
        }),

    operatorPhoneNo: Joi.number().min(10)
        .required()
        .messages({
            'number.base': 'Phone number must be a valid 10 digit phone number',
        }),
    
    
    
});

//middleware function to validate add addmin
const validateOperator = async(req, res, next) => {
   
    const { error } = operatorValidationSchema.validate(req.body, { abortEarly: false });
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

export default validateOperator;