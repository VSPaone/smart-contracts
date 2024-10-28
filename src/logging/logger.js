const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, errors } = format;
const path = require('path');

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

// Create a logger instance
const logger = createLogger({
    level: 'info', // Default log level
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }), // Capture stack traces for errors
        logFormat
    ),
    transports: [
        // Console transport for development
        new transports.Console({
            format: combine(
                colorize(), // Adds color to the console output
                logFormat
            )
        }),
        // File transport for storing logs in files
        new transports.File({
            filename: path.join(__dirname, '../logs/error.log'),
            level: 'error'
        }),
        new transports.File({
            filename: path.join(__dirname, '../logs/combined.log')
        })
    ],
    exitOnError: false // Prevents the logger from exiting the application on error
});

// Stream function for integrating with other libraries (e.g., HTTP request logging)
logger.stream = {
    write: (message) => {
        logger.info(message.trim());
    }
};

// Function to set the log level dynamically (useful for changing levels in runtime)
const setLogLevel = (level) => {
    logger.level = level;
    logger.info(`[LOGGER] Log level set to ${level}`);
};

// Function to log an information message
const info = (message) => {
    logger.info(message);
};

// Function to log a warning message
const warn = (message) => {
    logger.warn(message);
};

// Function to log an error message
const error = (message) => {
    logger.error(message);
};

// Function to log a debug message
const debug = (message) => {
    logger.debug(message);
};

module.exports = {
    info,
    warn,
    error,
    debug,
    setLogLevel,
    stream: logger.stream
};
