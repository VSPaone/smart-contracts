const cron = require('node-cron');
const eventProcessor = require('../events/eventProcessor');
const stateManager = require('../state/stateManager');
const contractValidator = require('../contracts/contractValidator');
const logger = require('../logging/logger');

// Schedule a task for state synchronization every 5 minutes
const scheduleStateSynchronization = () => {
    cron.schedule('*/5 * * * *', async () => {
        try {
            logger.info('[CRON JOB] State synchronization started.');
            await stateManager.synchronizeState();
            logger.info('[CRON JOB] State synchronization completed successfully.');
        } catch (error) {
            logger.error(`[CRON JOB ERROR] State synchronization failed: ${error.message}`);
        }
    });
};

// Schedule a task for validating contracts every hour
const scheduleContractValidation = () => {
    cron.schedule('0 * * * *', async () => {
        try {
            logger.info('[CRON JOB] Contract validation started.');
            const contracts = await contractValidator.getAllContracts();
            
            for (const contract of contracts) {
                try {
                    const validationResult = await contractValidator.validate(contract);
                    if (!validationResult.isValid) {
                        logger.warn(`[CRON JOB] Contract ${contract.id} validation failed: ${validationResult.message}`);
                    } else {
                        logger.info(`[CRON JOB] Contract ${contract.id} is valid.`);
                    }
                } catch (error) {
                    logger.error(`[CRON JOB ERROR] Validation failed for contract ${contract.id}: ${error.message}`);
                }
            }
            logger.info('[CRON JOB] Contract validation completed.');
        } catch (error) {
            logger.error(`[CRON JOB ERROR] Contract validation task failed: ${error.message}`);
        }
    });
};

// Schedule a task for processing events every 10 minutes
const scheduleEventProcessing = () => {
    cron.schedule('*/10 * * * *', async () => {
        try {
            logger.info('[CRON JOB] Event processing started.');
            await eventProcessor.processPendingEvents();
            logger.info('[CRON JOB] Event processing completed successfully.');
        } catch (error) {
            logger.error(`[CRON JOB ERROR] Event processing failed: ${error.message}`);
        }
    });
};

// Function to initialize all cron jobs
const initializeCronJobs = () => {
    scheduleStateSynchronization();
    scheduleContractValidation();
    scheduleEventProcessing();
    logger.info('[CRON JOB] All cron jobs initialized.');
};

module.exports = {
    initializeCronJobs
};
