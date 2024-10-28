const contractExecutor = require('../contracts/contractExecutor');
const logger = require('../logging/logger');
const Contract = require('../contracts/contractModel');

// Function to process contract events
const processContractEvent = async (contractId) => {
    try {
        logger.info(`[EVENT PROCESSOR] Processing contract event for Contract ID: ${contractId}`);
        // Execute the contract using contractExecutor
        const result = await contractExecutor.executeContract(contractId);

        // Log the result of the contract execution
        if (result.success) {
            logger.info(`[EVENT PROCESSOR] Contract ${contractId} executed successfully.`);
        } else {
            logger.error(`[EVENT PROCESSOR] Contract ${contractId} execution failed: ${result.message}`);
        }
    } catch (error) {
        logger.error(`[EVENT PROCESSOR ERROR] Error processing contract event for Contract ID ${contractId}: ${error.message}`);
    }
};

// Function to process time-based events
const processTimeEvent = async (timeCondition) => {
    try {
        logger.info(`[EVENT PROCESSOR] Processing time-based event with condition: ${JSON.stringify(timeCondition)}`);
        
        // Find contracts that match the time condition
        const contractsToExecute = await findContractsByTimeCondition(timeCondition);

        // Execute each contract that matches the time condition
        for (const contract of contractsToExecute) {
            await processContractEvent(contract._id);
        }
    } catch (error) {
        logger.error(`[EVENT PROCESSOR ERROR] Error processing time-based event: ${error.message}`);
    }
};

// Function to process state change events
const processStateChangeEvent = async (stateDetails) => {
    try {
        logger.info(`[EVENT PROCESSOR] Processing state change event: ${JSON.stringify(stateDetails)}`);
        
        // Find contracts that match the state change criteria
        const contractsToExecute = await findContractsByState(stateDetails);

        // Execute each contract that matches the state change criteria
        for (const contract of contractsToExecute) {
            await processContractEvent(contract._id);
        }
    } catch (error) {
        logger.error(`[EVENT PROCESSOR ERROR] Error processing state change event: ${error.message}`);
    }
};

// Function to find contracts based on a time condition
const findContractsByTimeCondition = async (timeCondition) => {
    try {
        const { timestamp } = timeCondition;

        // Find contracts where the scheduled timestamp is less than or equal to the given timestamp and the state is 'active'
        const contracts = await Contract.find({
            'timestamps.scheduled': { $lte: timestamp },
            state: 'active'
        });

        logger.info(`[EVENT PROCESSOR] Found ${contracts.length} contracts matching the time condition.`);
        return contracts;
    } catch (error) {
        logger.error(`[EVENT PROCESSOR ERROR] Error finding contracts by time condition: ${error.message}`);
        return [];
    }
};

// Function to find contracts based on state change criteria
const findContractsByState = async (stateDetails) => {
    try {
        const { field, value } = stateDetails;

        // Find contracts where the specified field matches the provided value and the state is 'active'
        const contracts = await Contract.find({
            [`conditions.field`]: field,
            [`conditions.value`]: value,
            state: 'active'
        });

        logger.info(`[EVENT PROCESSOR] Found ${contracts.length} contracts matching the state change criteria.`);
        return contracts;
    } catch (error) {
        logger.error(`[EVENT PROCESSOR ERROR] Error finding contracts by state: ${error.message}`);
        return [];
    }
};

module.exports = {
    processContractEvent,
    processTimeEvent,
    processStateChangeEvent
};
