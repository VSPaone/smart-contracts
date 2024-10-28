const EventEmitter = require('events');
const eventProcessor = require('./eventProcessor');
const logger = require('../logging/logger');

// Create an event emitter instance
class EventListener extends EventEmitter {}

// Instantiate the EventListener
const eventListener = new EventListener();

// Function to initialize the event listener and start listening for events
const initializeEventListener = () => {
    // Listen for a contract-related event
    eventListener.on('contractEvent', async (contractId) => {
        logger.info(`[EVENT RECEIVED] Contract Event for ID: ${contractId}`);
        try {
            await eventProcessor.processContractEvent(contractId);
        } catch (error) {
            logger.error(`[EVENT PROCESSING ERROR] Error processing contract event for ID ${contractId}: ${error.message}`);
        }
    });

    // Listen for a time-based event
    eventListener.on('timeEvent', async (timeCondition) => {
        logger.info(`[EVENT RECEIVED] Time Event triggered for condition: ${JSON.stringify(timeCondition)}`);
        try {
            await eventProcessor.processTimeEvent(timeCondition);
        } catch (error) {
            logger.error(`[EVENT PROCESSING ERROR] Error processing time event: ${error.message}`);
        }
    });

    // Listen for a state-based event
    eventListener.on('stateChangeEvent', async (stateDetails) => {
        logger.info(`[EVENT RECEIVED] State Change Event: ${JSON.stringify(stateDetails)}`);
        try {
            await eventProcessor.processStateChangeEvent(stateDetails);
        } catch (error) {
            logger.error(`[EVENT PROCESSING ERROR] Error processing state change event: ${error.message}`);
        }
    });

    logger.info('[EVENT LISTENER] Initialized and listening for events.');
};

// Function to emit contract events
const emitContractEvent = (contractId) => {
    eventListener.emit('contractEvent', contractId);
    logger.info(`[EVENT EMITTED] Contract Event for ID: ${contractId}`);
};

// Function to emit time-based events
const emitTimeEvent = (timeCondition) => {
    eventListener.emit('timeEvent', timeCondition);
    logger.info(`[EVENT EMITTED] Time Event for condition: ${JSON.stringify(timeCondition)}`);
};

// Function to emit state-based events
const emitStateChangeEvent = (stateDetails) => {
    eventListener.emit('stateChangeEvent', stateDetails);
    logger.info(`[EVENT EMITTED] State Change Event: ${JSON.stringify(stateDetails)}`);
};

module.exports = {
    initializeEventListener,
    emitContractEvent,
    emitTimeEvent,
    emitStateChangeEvent
};
