const logger = require('../logging/logger');

// Function to log general messages related to contracts
const log = (message) => {
    logger.info(`[CONTRACT] ${message}`);
};

// Function to log warnings related to contracts
const warn = (message) => {
    logger.warn(`[CONTRACT WARNING] ${message}`);
};

// Function to log errors related to contracts
const error = (message) => {
    logger.error(`[CONTRACT ERROR] ${message}`);
};

// Function to log specific contract execution details
const logExecution = (contractId, status, details) => {
    logger.info(`[CONTRACT EXECUTION] Contract ID: ${contractId}, Status: ${status}, Details: ${details}`);
};

// Function to log state changes in contracts
const logStateChange = (contractId, oldState, newState) => {
    logger.info(`[CONTRACT STATE CHANGE] Contract ID: ${contractId}, State changed from ${oldState} to ${newState}`);
};

// Function to log contract validation results
const logValidation = (contractId, result, errors = []) => {
    if (result) {
        logger.info(`[CONTRACT VALIDATION] Contract ID: ${contractId} validated successfully.`);
    } else {
        logger.error(`[CONTRACT VALIDATION ERROR] Contract ID: ${contractId}, Errors: ${errors.join(', ')}`);
    }
};

module.exports = {
    log,
    warn,
    error,
    logExecution,
    logStateChange,
    logValidation
};
