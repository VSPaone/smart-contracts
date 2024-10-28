const nodeManager = require('../managers/nodeManager');
const nodeHealth = require('../managers/nodeHealth');
const logger = require('../logging/logger');

// Function to register a new node
const registerNode = async (nodeData) => {
    try {
        const newNode = await nodeManager.register(nodeData);
        logger.info(`[NODE CONTROLLER] Node registered successfully with ID: ${newNode.id}`);
        return newNode;
    } catch (error) {
        logger.error(`[NODE CONTROLLER ERROR] Failed to register node: ${error.message}`);
        throw error;
    }
};

// Function to get all registered nodes
const getAllNodes = async () => {
    try {
        const nodes = await nodeManager.getAllNodes();
        logger.info(`[NODE CONTROLLER] Retrieved ${nodes.length} nodes.`);
        return nodes;
    } catch (error) {
        logger.error(`[NODE CONTROLLER ERROR] Failed to retrieve nodes: ${error.message}`);
        throw error;
    }
};

// Function to get a specific node by ID
const getNodeById = async (nodeId) => {
    try {
        const node = await nodeManager.getNodeById(nodeId);
        if (!node) {
            logger.warn(`[NODE CONTROLLER] Node with ID: ${nodeId} not found.`);
            return null;
        }
        logger.info(`[NODE CONTROLLER] Node with ID: ${nodeId} retrieved.`);
        return node;
    } catch (error) {
        logger.error(`[NODE CONTROLLER ERROR] Failed to retrieve node with ID: ${nodeId} - ${error.message}`);
        throw error;
    }
};

// Function to update a node's details
const updateNode = async (nodeId, updateData) => {
    try {
        const updatedNode = await nodeManager.updateNode(nodeId, updateData);
        if (!updatedNode) {
            logger.warn(`[NODE CONTROLLER] Node with ID: ${nodeId} not found for update.`);
            return null;
        }
        logger.info(`[NODE CONTROLLER] Node with ID: ${nodeId} updated successfully.`);
        return updatedNode;
    } catch (error) {
        logger.error(`[NODE CONTROLLER ERROR] Failed to update node with ID: ${nodeId} - ${error.message}`);
        throw error;
    }
};

// Function to delete a node by ID
const deleteNode = async (nodeId) => {
    try {
        const deleted = await nodeManager.deleteNode(nodeId);
        if (!deleted) {
            logger.warn(`[NODE CONTROLLER] Node with ID: ${nodeId} not found for deletion.`);
            return null;
        }
        logger.info(`[NODE CONTROLLER] Node with ID: ${nodeId} deleted successfully.`);
        return true;
    } catch (error) {
        logger.error(`[NODE CONTROLLER ERROR] Failed to delete node with ID: ${nodeId} - ${error.message}`);
        throw error;
    }
};

// Function to check the health of a specific node by ID
const checkNodeHealth = async (nodeId) => {
    try {
        const healthStatus = await nodeHealth.getNodeHealth(nodeId);
        if (!healthStatus) {
            logger.warn(`[NODE CONTROLLER] Health check failed for node with ID: ${nodeId}. Node not found.`);
            return null;
        }
        logger.info(`[NODE CONTROLLER] Node with ID: ${nodeId} health check successful.`);
        return healthStatus;
    } catch (error) {
        logger.error(`[NODE CONTROLLER ERROR] Failed to check health for node with ID: ${nodeId} - ${error.message}`);
        throw error;
    }
};

// Function to get the overall health of the system (all nodes)
const getSystemHealth = async () => {
    try {
        const systemHealth = await nodeHealth.getSystemHealth();
        logger.info(`[NODE CONTROLLER] System health check completed.`);
        return systemHealth;
    } catch (error) {
        logger.error(`[NODE CONTROLLER ERROR] Failed to get system health - ${error.message}`);
        throw error;
    }
};

module.exports = {
    registerNode,
    getAllNodes,
    getNodeById,
    updateNode,
    deleteNode,
    checkNodeHealth,
    getSystemHealth
};
