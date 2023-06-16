const AppError = require('../utils/appError');

const handleCastError = err => {
    const message = `Invalid ${err.path} : ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const dupField = Object.keys(err.keyPattern ? err.keyPattern : err.keyValue)[0];
    const message = `Duplicate field value for ${dupField}. Please use another value!`;
    return new AppError(message, 400);
}

const handleJWTError = err => new AppError('Invalid token. Please log in again.', 401);

const handleTokenExpiredError = err => new AppError('Your token is expired. Please log in again.', 401);

const handleValidationErrorDB = err => {
    const errKeys = Object.keys(err.errors);
    return new AppError(Object.values(err.errors).map((el, i) => `${errKeys[i]} : ${el.message}`).join(','), 400);
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
};

const sendErrorProd = (err, res) => {
    // operational errors are above handled ones
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    else {
        // unknown/ unhandled errors we cant send
        console.error('Error : ', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong. Please let us know about it.'
        });
    }
}

// error handler
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') sendErrorDev(err, res);

    else if (process.env.NODE_ENV === 'production') {
        // hard copy
        const error = { ...err };
        error.message = err.message;
        error.name = err.name;

        if (error.name === 'CastError') error = handleCastError(error);

        // for mongoose unique value duplicates
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);

        // validation errors 
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

        // jwt
        if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
        if (error.name === 'TokenExpiredError') error = handleTokenExpiredError(error);

        sendErrorProd(error, res);
    }
}