import Joi from 'joi';
import {AppError} from '../utils/error_handler.js'

//use validation scema
const userValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 3 characters',
        'string.max': 'Name cannot exceed 50 characters',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'string.empty': 'Email is required',
    }),
    password: Joi.string()
        .pattern(new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/))
        .required()
        .messages({
            'string.pattern.base': 'Password must include uppercase, lowercase, number, special character, and be at least 6 characters long',
            'string.empty': 'Password is required',
        }),
    
    role: Joi.string().valid('operator', 'admin', 'commuter').optional(),
});

//middleware function to validate signup
const validateSignup = (req, res, next) => {
   
    const { error } = userValidationSchema.validate(req.body, { abortEarly: false });
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

export default validateSignup;