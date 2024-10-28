const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const constants = require('./utils/constants');
const logger = require('./logging/logger');
const authMiddleware = require('./middlewares/authMiddleware');
const errorHandler = require('./middlewares/errorHandler');
const contractRoutes = require('./api/routes/contractRoutes');
const nodeRoutes = require('./api/routes/nodeRoutes');
const eventRoutes = require('./api/routes/eventRoutes');
const { initializeCronJobs } = require('./utils/cronJobs');

const app = express();

// Middleware setup
app.use(helmet()); // Security middleware
app.use(cors()); // Cross-Origin Resource Sharing
app.use(morgan('combined', { stream: logger.stream })); // Logging HTTP requests
app.use(bodyParser.json()); // Parsing JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parsing URL-encoded bodies

// API routes setup
app.use('/api/contracts', authMiddleware, contractRoutes);
app.use('/api/nodes', authMiddleware, nodeRoutes);
app.use('/api/events', authMiddleware, eventRoutes);

// Home route for testing the server
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Smart Contracts API!' });
});

// Error handling middleware
app.use(errorHandler);

// Database connection
const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartcontracts', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        logger.info('[DATABASE] Connected to MongoDB successfully.');
    } catch (error) {
        logger.error(`[DATABASE ERROR] Failed to connect to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

// Initialize the server
const startServer = async () => {
    try {
        await connectDatabase(); // Connect to the database
        initializeCronJobs(); // Initialize cron jobs

        const port = constants.DEFAULT_PORT;
        app.listen(port, () => {
            logger.info(`[SERVER] Server running on port ${port}`);
        });
    } catch (error) {
        logger.error(`[SERVER ERROR] Failed to start the server: ${error.message}`);
        process.exit(1);
    }
};

// Start the application
startServer();
