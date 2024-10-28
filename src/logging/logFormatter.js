const { format } = require('winston');
const { printf, timestamp, combine, errors, colorize } = format;

// Custom log format function
const customLogFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

// Function to create a formatted log structure
const createLogFormat = (useColor = false) => {
    // If useColor is true, colorize the console output
    const logFormats = [
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Adds a timestamp to each log
        errors({ stack: true }), // Captures stack trace information for error logs
        customLogFormat // Uses the custom format for log output
    ];

    if (useColor) {
        logFormats.unshift(colorize());
    }

    return combine(...logFormats);
};

module.exports = {
    createLogFormat
};
