const logger = require('../logging/logger');

// Function to log user actions
const logUserAction = (username, action, details = {}) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[AUDIT TRAIL] User: ${username}, Action: ${action}, Details: ${JSON.stringify(details)}, Timestamp: ${timestamp}`;
    logger.info(logMessage);
};

// Function to log node actions
const logNodeAction = (nodeId, action, details = {}) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[AUDIT TRAIL] Node ID: ${nodeId}, Action: ${action}, Details: ${JSON.stringify(details)}, Timestamp: ${timestamp}`;
    logger.info(logMessage);
};

// Function to log state changes
const logStateChange = (entity, stateChangeDetails) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[AUDIT TRAIL] Entity: ${entity}, State Change: ${JSON.stringify(stateChangeDetails)}, Timestamp: ${timestamp}`;
    logger.info(logMessage);
};

// Function to log contract execution
const logContractExecution = (contractId, executor, executionDetails = {}) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[AUDIT TRAIL] Contract ID: ${contractId}, Executed by: ${executor}, Execution Details: ${JSON.stringify(executionDetails)}, Timestamp: ${timestamp}`;
    logger.info(logMessage);
};

// Function to log errors specifically related to audit events
const logAuditError = (context, error) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[AUDIT TRAIL ERROR] Context: ${context}, Error: ${error.message}, Timestamp: ${timestamp}`;
    logger.error(logMessage);
};

// Function to retrieve logs (this is a placeholder - actual implementation may vary based on the logging storage)
const getLogs = (filter = {}) => {
    // In a real application, this function would retrieve logs from a database or log storage service.
    logger.info(`[AUDIT TRAIL] Retrieving logs with filter: ${JSON.stringify(filter)}`);
    // Placeholder return - the actual implementation may query a log store or file system
    return [];
};

module.exports = {
    logUserAction,
    logNodeAction,
    logStateChange,
    logContractExecution,
    logAuditError,
    getLogs
};
