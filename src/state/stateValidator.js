const logger = require('../logging/logger');

// List of allowed states for validation purposes
const allowedStates = ['active', 'inactive', 'completed', 'failed'];

// Function to validate the structure of a state object
const validateStateStructure = (state) => {
    if (!state || typeof state !== 'object') {
        logger.error('[STATE VALIDATOR] Invalid state structure: State must be an object.');
        return false;
    }

    // Check required fields (e.g., stateName, timestamp)
    if (!state.stateName || !allowedStates.includes(state.stateName)) {
        logger.error(`[STATE VALIDATOR] Invalid state: stateName must be one of ${allowedStates.join(', ')}.`);
        return false;
    }

    if (!state.timestamp || isNaN(new Date(state.timestamp).getTime())) {
        logger.error('[STATE VALIDATOR] Invalid state: timestamp is required and must be a valid date.');
        return false;
    }

    return true;
};

// Function to validate state transition logic
const validateStateTransition = (previousState, newState) => {
    // Ensure both states are valid
    if (!validateStateStructure(previousState) || !validateStateStructure(newState)) {
        return false;
    }

    // Validate stateName transition rules
    if (previousState.stateName === 'completed' || previousState.stateName === 'failed') {
        logger.error('[STATE VALIDATOR] Invalid state transition: cannot transition from a completed or failed state.');
        return false;
    }

    // Allow transitions to 'completed' or 'failed' from any active state
    if (newState.stateName === 'completed' || newState.stateName === 'failed') {
        return true;
    }

    // Prevent any other invalid state changes
    if (previousState.stateName === newState.stateName) {
        logger.error('[STATE VALIDATOR] Invalid state transition: state cannot remain unchanged.');
        return false;
    }

    // Additional logic for other state transitions can be added here if needed
    return true;
};

// Function to validate an update before it is applied
const validateStateUpdate = (contractId, previousState, newState) => {
    logger.info(`[STATE VALIDATOR] Validating state update for Contract ID: ${contractId}`);

    // Validate the structure of both the previous and new states
    if (!validateStateStructure(previousState) || !validateStateStructure(newState)) {
        logger.error(`[STATE VALIDATOR] State update validation failed for Contract ID: ${contractId}`);
        return { isValid: false, message: 'Invalid state structure' };
    }

    // Validate the state transition logic
    if (!validateStateTransition(previousState, newState)) {
        logger.error(`[STATE VALIDATOR] State transition validation failed for Contract ID: ${contractId}`);
        return { isValid: false, message: 'Invalid state transition' };
    }

    logger.info(`[STATE VALIDATOR] State update for Contract ID: ${contractId} is valid.`);
    return { isValid: true, message: 'Valid state update' };
};

module.exports = {
    validateStateUpdate,
    validateStateStructure,
    validateStateTransition
};
