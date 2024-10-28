const mongoose = require('mongoose');
const logger = require('../logging/logger');

// Database configuration options
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/smart_contracts';
const DB_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    connectTimeoutMS: 10000, // 10 seconds timeout for initial connection
    socketTimeoutMS: 45000 // 45 seconds for socket timeout
};

// Function to establish a connection to the database
const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI, DB_OPTIONS);
        logger.info('[DB CONFIG] Successfully connected to the database.');
    } catch (error) {
        logger.error(`[DB CONFIG ERROR] Failed to connect to the database: ${error.message}`);
        process.exit(1); // Exit the process if the database connection fails
    }
};

// Function to close the database connection
const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        logger.info('[DB CONFIG] Database connection closed.');
    } catch (error) {
        logger.error(`[DB CONFIG ERROR] Failed to close the database connection: ${error.message}`);
    }
};

// Function to get the current database connection status
const getDBStatus = () => {
    const state = mongoose.connection.readyState;
    switch (state) {
        case 0:
            return 'Disconnected';
        case 1:
            return 'Connected';
        case 2:
            return 'Connecting';
        case 3:
            return 'Disconnecting';
        default:
            return 'Unknown';
    }
};

// Event listeners for mongoose connection
mongoose.connection.on('connected', () => {
    logger.info('[DB CONFIG] Mongoose connected to the database.');
});

mongoose.connection.on('error', (error) => {
    logger.error(`[DB CONFIG ERROR] Mongoose connection error: ${error.message}`);
});

mongoose.connection.on('disconnected', () => {
    logger.warn('[DB CONFIG] Mongoose connection disconnected.');
});

// Function to initialize the database (connect)
const initializeDB = async () => {
    await connectDB();
};

module.exports = {
    initializeDB,
    disconnectDB,
    getDBStatus
};
