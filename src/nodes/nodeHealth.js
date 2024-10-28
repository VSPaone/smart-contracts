const axios = require('axios');
const logger = require('../logging/logger');

// Configuration constants (e.g., health check interval and timeout limits)
const HEALTH_CHECK_TIMEOUT = 5000; // 5 seconds
const HEALTH_CHECK_ENDPOINT = '/health';
const RECOVERY_ATTEMPTS = 3;

// Function to check the health of a node
const checkNodeHealth = async (node) => {
    try {
        const healthCheckUrl = `${node.address}${HEALTH_CHECK_ENDPOINT}`;
        const response = await axios.get(healthCheckUrl, { timeout: HEALTH_CHECK_TIMEOUT });

        if (response.status === 200 && response.data.status === 'healthy') {
            logger.info(`[NODE HEALTH] Node ${node.id} is healthy.`);
            return true;
        } else {
            logger.warn(`[NODE HEALTH] Node ${node.id} responded but is not healthy. Response: ${response.data.status}`);
            triggerRecoveryProtocol(node);
            return false;
        }
    } catch (error) {
        logger.error(`[NODE HEALTH ERROR] Node ${node.id} health check failed: ${error.message}`);
        triggerRecoveryProtocol(node);
        return false;
    }
};

// Function to trigger recovery protocols for an unhealthy node
const triggerRecoveryProtocol = async (node) => {
    logger.warn(`[NODE HEALTH] Triggering recovery protocol for node ${node.id}`);

    for (let attempt = 1; attempt <= RECOVERY_ATTEMPTS; attempt++) {
        logger.info(`[NODE HEALTH] Attempting recovery for node ${node.id}, Attempt ${attempt}/${RECOVERY_ATTEMPTS}`);
        
        const recoverySuccess = await attemptNodeRecovery(node);
        if (recoverySuccess) {
            logger.info(`[NODE HEALTH] Node ${node.id} recovered successfully.`);
            return true;
        }

        logger.warn(`[NODE HEALTH] Recovery attempt ${attempt} for node ${node.id} failed.`);
    }

    logger.error(`[NODE HEALTH] All recovery attempts for node ${node.id} have failed. Node is marked as inactive.`);
    sendAlert(node);
    return false;
};

// Function to attempt node recovery
const attemptNodeRecovery = async (node) => {
    try {
        // Example of a recovery action: sending a restart request to the node
        const restartEndpoint = `${node.address}/restart`;
        const response = await axios.post(restartEndpoint, {}, { timeout: HEALTH_CHECK_TIMEOUT });

        if (response.status === 200 && response.data.status === 'restarted') {
            logger.info(`[NODE HEALTH] Node ${node.id} restart successful.`);
            return true;
        } else {
            logger.warn(`[NODE HEALTH] Node ${node.id} restart request failed. Response: ${response.data.status}`);
            return false;
        }
    } catch (error) {
        logger.error(`[NODE HEALTH ERROR] Recovery attempt for node ${node.id} failed: ${error.message}`);
        return false;
    }
};

// Function to send an alert when a node fails recovery attempts
const sendAlert = (node) => {
    // This could be integrated with a monitoring or alerting service (e.g., email, SMS, Slack)
    logger.error(`[NODE HEALTH ALERT] Node ${node.id} has failed all recovery attempts and is now inactive. Alerting the system administrator.`);
    // Example: send an email or push a notification
};

module.exports = {
    checkNodeHealth
};
