class AppError extends Error {
    constructor(message, statusCode, errorType = 'GenericError', details = null) {
        super(message);
        this.statusCode = statusCode;
        this.errorType = errorType; // E.g., ValidationError, AuthenticationError
        this.details = details; // Additional error information, if any
        // this.isOperational = true; // Flag to identify operational errors
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

const errorMiddleware = (err, req, res, next) => {
    let { statusCode, message, errorType } = err;

    // Default to 500 for unexpected errors
    statusCode = statusCode || 500;
    errorType = errorType || 'ServerError';

    // Handle specific error scenarios
    if (err.name === 'ValidationError') {
        statusCode = 400;
        errorType = 'ValidationError';
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        errorType = 'AuthenticationError';
        message = 'Invalid Token. Please log in again.';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        errorType = 'AuthenticationError';
        message = 'Token has expired. Please log in again.';
    }

    if (err.name === 'CastError') {
        statusCode = 400;
        errorType = 'DatabaseError';
        message = `Invalid ${err.path}: ${err.value}.`;
    }

    // Default response
    const response = {
        success: false,
        statusCode,
        errorType,
        message,
        details: err.details || null,
    };

    // Log unexpected errors
    if (!err.isOperational) {
        console.error('Unexpected Error:', err);
    }

    res.status(statusCode).json(response);
};

export  {AppError,errorMiddleware };

