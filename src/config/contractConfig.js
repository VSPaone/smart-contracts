const dotenv = require('dotenv');
const path = require('path');
const logger = require('../logging/logger');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Default contract configuration
const contractConfig = {
    executionTimeout: process.env.CONTRACT_EXECUTION_TIMEOUT || 60000, // Timeout period for contract execution (in ms, default: 60 seconds)
    maxRetries: process.env.CONTRACT_MAX_RETRIES || 3, // Maximum number of retries for executing a contract
    validationRules: {
        maxConditions: process.env.CONTRACT_MAX_CONDITIONS || 10, // Maximum number of conditions allowed in a contract
        maxActions: process.env.CONTRACT_MAX_ACTIONS || 10, // Maximum number of actions allowed in a contract
        allowedDataTypes: process.env.CONTRACT_ALLOWED_DATA_TYPES || ['string', 'number', 'boolean'], // Allowed data types for contract conditions and actions
        maxExecutionTime: process.env.CONTRACT_MAX_EXECUTION_TIME || 30000, // Maximum allowed execution time for a contract (in ms, default: 30 seconds)
    },
    auditLogging: process.env.CONTRACT_AUDIT_LOGGING_ENABLED === 'true', // Enable or disable audit logging for contracts
    statePersistenceInterval: process.env.CONTRACT_STATE_PERSISTENCE_INTERVAL || 300000 // Interval for persisting contract state (in ms, default: 5 minutes)
};

// Log the loaded contract configuration for debugging purposes
logger.info(`[CONTRACT CONFIG] Loaded configuration: ${JSON.stringify(contractConfig)}`);

module.exports = contractConfig;
