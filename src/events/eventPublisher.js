const nodeManager = require('../nodes/nodeManager');
const eventListener = require('./eventListener');
const logger = require('../logging/logger');

// Function to publish a contract event to all registered nodes
const publishContractEvent = async (contractId) => {
    try {
        logger.info(`[EVENT PUBLISHER] Publishing contract event for Contract ID: ${contractId}`);
        
        // Retrieve all active nodes from the node manager
        const nodes = await nodeManager.getActiveNodes();
        if (nodes.length === 0) {
            logger.warn(`[EVENT PUBLISHER] No active nodes available for contract event ${contractId}`);
            return;
        }

        // Emit the contract event to each node
        nodes.forEach(node => {
            emitEventToNode(node, 'contractEvent', { contractId });
        });

        // Emit the event locally for internal processing
        eventListener.emitContractEvent(contractId);

        logger.info(`[EVENT PUBLISHER] Contract event for ID ${contractId} published to ${nodes.length} nodes.`);
    } catch (error) {
        logger.error(`[EVENT PUBLISHER ERROR] Error publishing contract event for ID ${contractId}: ${error.message}`);
    }
};

// Function to publish a time-based event
const publishTimeEvent = async (timeCondition) => {
    try {
        logger.info(`[EVENT PUBLISHER] Publishing time-based event for condition: ${JSON.stringify(timeCondition)}`);

        // Retrieve all active nodes
        const nodes = await nodeManager.getActiveNodes();
        if (nodes.length === 0) {
            logger.warn(`[EVENT PUBLISHER] No active nodes available for time event.`);
            return;
        }

        // Emit the time event to each node
        nodes.forEach(node => {
            emitEventToNode(node, 'timeEvent', { timeCondition });
        });

        // Emit the event locally for internal processing
        eventListener.emitTimeEvent(timeCondition);

        logger.info(`[EVENT PUBLISHER] Time-based event published to ${nodes.length} nodes.`);
    } catch (error) {
        logger.error(`[EVENT PUBLISHER ERROR] Error publishing time event: ${error.message}`);
    }
};

// Function to publish a state change event
const publishStateChangeEvent = async (stateDetails) => {
    try {
        logger.info(`[EVENT PUBLISHER] Publishing state change event: ${JSON.stringify(stateDetails)}`);

        // Retrieve all active nodes
        const nodes = await nodeManager.getActiveNodes();
        if (nodes.length === 0) {
            logger.warn(`[EVENT PUBLISHER] No active nodes available for state change event.`);
            return;
        }

        // Emit the state change event to each node
        nodes.forEach(node => {
            emitEventToNode(node, 'stateChangeEvent', { stateDetails });
        });

        // Emit the event locally for internal processing
        eventListener.emitStateChangeEvent(stateDetails);

        logger.info(`[EVENT PUBLISHER] State change event published to ${nodes.length} nodes.`);
    } catch (error) {
        logger.error(`[EVENT PUBLISHER ERROR] Error publishing state change event: ${error.message}`);
    }
};

// Function to emit an event to a specific node
const emitEventToNode = (node, eventType, eventData) => {
    try {
        // Simulate sending an event to the node (could be through a WebSocket, HTTP request, or another protocol)
        logger.info(`[EVENT PUBLISHER] Emitting ${eventType} to Node ${node.id} at ${node.address}`);
        // Example: Using a hypothetical WebSocket connection or HTTP request
        // node.socket.emit(eventType, eventData);
        // OR:
        // axios.post(`${node.address}/events`, { type: eventType, data: eventData });
        
        // For now, we log that the event has been emitted
        console.log(`[EVENT PUBLISHER] Event ${eventType} emitted to node ${node.id}`);
    } catch (error) {
        logger.error(`[EVENT PUBLISHER ERROR] Error emitting event ${eventType} to node ${node.id}: ${error.message}`);
    }
};

module.exports = {
    publishContractEvent,
    publishTimeEvent,
    publishStateChangeEvent
};
