const logger = require('../logging/logger');

// Function to log state initialization
const logStateInitialization = (contractId, initialState) => {
    logger.info(`[STATE LOGGER] State initialized for Contract ID: ${contractId}. Initial State: ${JSON.stringify(initialState)}`);
};

// Function to log state updates
const logStateUpdate = (contractId, previousState, newState) => {
    logger.info(`[STATE LOGGER] State updated for Contract ID: ${contractId}. Previous State: ${JSON.stringify(previousState)}, New State: ${JSON.stringify(newState)}`);
};

// Function to log state removal
const logStateRemoval = (contractId, previousState) => {
    logger.info(`[STATE LOGGER] State removed for Contract ID: ${contractId}. Previous State: ${JSON.stringify(previousState)}`);
};

// Function to log state validation results
const logStateValidation = (contractId, result, message) => {
    if (result) {
        logger.info(`[STATE LOGGER] State validation successful for Contract ID: ${contractId}. Message: ${message}`);
    } else {
        logger.error(`[STATE LOGGER] State validation failed for Contract ID: ${contractId}. Message: ${message}`);
    }
};

// Function to log any errors in state management
const logStateError = (contractId, error) => {
    logger.error(`[STATE LOGGER] Error for Contract ID: ${contractId}. Error: ${error}`);
};

module.exports = {
    logStateInitialization,
    logStateUpdate,
    logStateRemoval,
    logStateValidation,
    logStateError
};
