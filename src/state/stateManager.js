const nodeSync = require('./nodeSync');
const stateLogger = require('./stateLogger');
const nodeManager = require('../nodes/nodeManager');
const logger = require('../logging/logger');

// Central state storage (this could be a database in a real implementation)
const stateStore = new Map();

// Function to initialize state for a new contract
const initializeState = async (contractId, initialState) => {
    try {
        stateStore.set(contractId, initialState);
        stateLogger.logStateInitialization(contractId, initialState);

        // Sync the state with all active nodes
        const nodes = await nodeManager.getActiveNodes();
        await nodeSync.syncStateWithNodes(contractId, initialState, nodes);

        logger.info(`[STATE MANAGER] Initialized state for contract ${contractId}`);
    } catch (error) {
        logger.error(`[STATE MANAGER ERROR] Error initializing state for contract ${contractId}: ${error.message}`);
    }
};

// Function to update the state of a contract
const updateState = async (contractId, newState) => {
    try {
        const previousState = stateStore.get(contractId);

        if (!previousState) {
            logger.error(`[STATE MANAGER ERROR] No previous state found for contract ${contractId}`);
            return;
        }

        // Update the state in the central state store
        stateStore.set(contractId, newState);
        stateLogger.logStateUpdate(contractId, previousState, newState);

        // Sync the updated state with all active nodes
        const nodes = await nodeManager.getActiveNodes();
        await nodeSync.syncStateWithNodes(contractId, newState, nodes);

        logger.info(`[STATE MANAGER] State for contract ${contractId} updated successfully.`);
    } catch (error) {
        logger.error(`[STATE MANAGER ERROR] Error updating state for contract ${contractId}: ${error.message}`);
    }
};

// Function to get the state of a contract
const getState = (contractId) => {
    try {
        const state = stateStore.get(contractId);

        if (!state) {
            logger.warn(`[STATE MANAGER] No state found for contract ${contractId}`);
            return null;
        }

        logger.info(`[STATE MANAGER] Retrieved state for contract ${contractId}: ${JSON.stringify(state)}`);
        return state;
    } catch (error) {
        logger.error(`[STATE MANAGER ERROR] Error retrieving state for contract ${contractId}: ${error.message}`);
        return null;
    }
};

// Function to remove the state of a contract
const removeState = async (contractId) => {
    try {
        const previousState = stateStore.get(contractId);

        if (!previousState) {
            logger.warn(`[STATE MANAGER] No state found for contract ${contractId} to remove.`);
            return;
        }

        stateStore.delete(contractId);
        stateLogger.logStateRemoval(contractId, previousState);

        // Notify all nodes about the removal of the state
        const nodes = await nodeManager.getActiveNodes();
        await nodeSync.removeStateFromNodes(contractId, nodes);

        logger.info(`[STATE MANAGER] State for contract ${contractId} removed successfully.`);
    } catch (error) {
        logger.error(`[STATE MANAGER ERROR] Error removing state for contract ${contractId}: ${error.message}`);
    }
};

module.exports = {
    initializeState,
    updateState,
    getState,
    removeState
};
