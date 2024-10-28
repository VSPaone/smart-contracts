const nodeHealth = require('./nodeHealth');
const nodeSync = require('./nodeSync');
const logger = require('../logging/logger');

// In-memory storage for nodes (this could be replaced with a database in a production environment)
const nodes = new Map();

// Function to register a new node
const registerNode = (nodeId, nodeAddress) => {
    if (nodes.has(nodeId)) {
        logger.warn(`[NODE MANAGER] Node with ID ${nodeId} is already registered.`);
        return false;
    }

    // Initialize node details
    const nodeDetails = {
        id: nodeId,
        address: nodeAddress,
        lastHealthCheck: new Date(),
        status: 'active'
    };

    nodes.set(nodeId, nodeDetails);
    logger.info(`[NODE MANAGER] Node registered with ID: ${nodeId}, Address: ${nodeAddress}`);

    return true;
};

// Function to deregister a node
const deregisterNode = (nodeId) => {
    if (!nodes.has(nodeId)) {
        logger.warn(`[NODE MANAGER] Node with ID ${nodeId} is not registered.`);
        return false;
    }

    nodes.delete(nodeId);
    logger.info(`[NODE MANAGER] Node with ID ${nodeId} has been deregistered.`);

    return true;
};

// Function to get details of all active nodes
const getActiveNodes = async () => {
    const activeNodes = [];

    for (const [nodeId, nodeDetails] of nodes.entries()) {
        // Check the health of each node before considering it active
        const isHealthy = await nodeHealth.checkNodeHealth(nodeDetails);
        if (isHealthy) {
            activeNodes.push(nodeDetails);
        } else {
            logger.warn(`[NODE MANAGER] Node ${nodeId} is not healthy. Marking as inactive.`);
            updateNodeStatus(nodeId, 'inactive');
        }
    }

    logger.info(`[NODE MANAGER] Retrieved ${activeNodes.length} active nodes.`);
    return activeNodes;
};

// Function to update a node's status
const updateNodeStatus = (nodeId, status) => {
    if (!nodes.has(nodeId)) {
        logger.warn(`[NODE MANAGER] Node with ID ${nodeId} not found.`);
        return false;
    }

    const nodeDetails = nodes.get(nodeId);
    nodeDetails.status = status;
    nodeDetails.lastHealthCheck = new Date();

    nodes.set(nodeId, nodeDetails);
    logger.info(`[NODE MANAGER] Node ${nodeId} status updated to ${status}.`);

    return true;
};

// Function to synchronize state with all nodes
const syncStateWithAllNodes = async (contractId, state) => {
    const activeNodes = await getActiveNodes();

    for (const node of activeNodes) {
        try {
            await nodeSync.syncStateWithNode(node, contractId, state);
            logger.info(`[NODE MANAGER] State for contract ${contractId} synchronized with node ${node.id}`);
        } catch (error) {
            logger.error(`[NODE MANAGER ERROR] Failed to sync state with node ${node.id}: ${error.message}`);
        }
    }
};

// Function to retrieve the details of a specific node
const getNodeDetails = (nodeId) => {
    if (!nodes.has(nodeId)) {
        logger.warn(`[NODE MANAGER] Node with ID ${nodeId} not found.`);
        return null;
    }

    const nodeDetails = nodes.get(nodeId);
    logger.info(`[NODE MANAGER] Retrieved details for node ${nodeId}: ${JSON.stringify(nodeDetails)}`);
    return nodeDetails;
};

// Function to check and update the health status of all nodes
const checkAndUpdateNodeHealth = async () => {
    for (const [nodeId, nodeDetails] of nodes.entries()) {
        const isHealthy = await nodeHealth.checkNodeHealth(nodeDetails);
        const newStatus = isHealthy ? 'active' : 'inactive';

        if (nodeDetails.status !== newStatus) {
            updateNodeStatus(nodeId, newStatus);
        }
    }
};

module.exports = {
    registerNode,
    deregisterNode,
    getActiveNodes,
    updateNodeStatus,
    syncStateWithAllNodes,
    getNodeDetails,
    checkAndUpdateNodeHealth
};
