const logger = require('../logging/logger');

// Middleware function for handling errors
const errorHandler = (err, req, res, next) => {
    // Log the error details for debugging purposes
    logger.error(`[ERROR HANDLER] ${err.message}`, {
        stack: err.stack,
        statusCode: err.statusCode || 500,
        method: req.method,
        url: req.originalUrl
    });

    // Set the status code (default to 500 for internal server errors)
    const statusCode = err.statusCode || 500;

    // Respond with a standardized error message
    res.status(statusCode).json({
        success: false,
        error: {
            message: err.message || 'Internal Server Error',
            code: statusCode,
        }
    });
};

module.exports = errorHandler;
