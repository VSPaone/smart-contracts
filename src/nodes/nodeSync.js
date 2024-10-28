const axios = require('axios');
const logger = require('../logging/logger');
const nodeManager = require('./nodeManager');

// Configuration constants
const SYNC_TIMEOUT = 5000; // 5 seconds
const SYNC_ENDPOINT = '/sync';

// Function to synchronize state with a specific node
const syncStateWithNode = async (node, contractId, state) => {
    try {
        const syncUrl = `${node.address}${SYNC_ENDPOINT}`;
        const response = await axios.post(syncUrl, { contractId, state }, { timeout: SYNC_TIMEOUT });

        if (response.status === 200 && response.data.status === 'synced') {
            logger.info(`[NODE SYNC] State for contract ${contractId} successfully synced with node ${node.id}`);
            return true;
        } else {
            logger.warn(`[NODE SYNC] Failed to sync state for contract ${contractId} with node ${node.id}. Response: ${response.data.status}`);
            return false;
        }
    } catch (error) {
        logger.error(`[NODE SYNC ERROR] Error syncing state for contract ${contractId} with node ${node.id}: ${error.message}`);
        return false;
    }
};

// Function to synchronize state with multiple nodes
const syncStateWithNodes = async (contractId, state, nodes) => {
    const syncResults = await Promise.all(nodes.map(async (node) => {
        return syncStateWithNode(node, contractId, state);
    }));

    // Check if any sync operation failed
    const failedSyncs = syncResults.filter(result => !result).length;
    if (failedSyncs > 0) {
        logger.warn(`[NODE SYNC] ${failedSyncs} nodes failed to sync state for contract ${contractId}.`);
    } else {
        logger.info(`[NODE SYNC] State for contract ${contractId} successfully synced with all nodes.`);
    }
};

// Function to retrieve and reconcile state from all nodes (e.g., in case of discrepancies)
const reconcileStateAcrossNodes = async (contractId) => {
    const activeNodes = await nodeManager.getActiveNodes();
    const stateResults = await Promise.all(activeNodes.map(async (node) => {
        try {
            const stateUrl = `${node.address}/state/${contractId}`;
            const response = await axios.get(stateUrl, { timeout: SYNC_TIMEOUT });

            if (response.status === 200) {
                return { nodeId: node.id, state: response.data.state };
            } else {
                logger.warn(`[NODE SYNC] Node ${node.id} responded with an error for contract ${contractId} state retrieval.`);
                return null;
            }
        } catch (error) {
            logger.error(`[NODE SYNC ERROR] Error retrieving state for contract ${contractId} from node ${node.id}: ${error.message}`);
            return null;
        }
    }));

    // Filter out any failed state retrievals
    const validStates = stateResults.filter(result => result !== null);

    // If no states are retrieved, return an error
    if (validStates.length === 0) {
        logger.error(`[NODE SYNC] No valid states found for contract ${contractId} across all nodes.`);
        return null;
    }

    // Compare the states retrieved from nodes to find discrepancies
    const primaryState = validStates[0].state;
    const consistent = validStates.every(result => JSON.stringify(result.state) === JSON.stringify(primaryState));

    if (consistent) {
        logger.info(`[NODE SYNC] State for contract ${contractId} is consistent across all nodes.`);
        return primaryState;
    } else {
        logger.warn(`[NODE SYNC] State discrepancies detected for contract ${contractId}. Initiating reconciliation.`);
        await resolveDiscrepancies(contractId, primaryState, validStates);
        return primaryState;
    }
};

// Function to resolve state discrepancies across nodes
const resolveDiscrepancies = async (contractId, primaryState, states) => {
    for (const { nodeId, state } of states) {
        if (JSON.stringify(state) !== JSON.stringify(primaryState)) {
            const node = nodeManager.getNodeDetails(nodeId);
            if (node) {
                logger.warn(`[NODE SYNC] Resolving state discrepancy for node ${nodeId} for contract ${contractId}.`);
                await syncStateWithNode(node, contractId, primaryState);
            }
        }
    }
};

// Function to remove state from all nodes when a contract is deleted
const removeStateFromNodes = async (contractId, nodes) => {
    await Promise.all(nodes.map(async (node) => {
        try {
            const deleteUrl = `${node.address}/state/${contractId}`;
            const response = await axios.delete(deleteUrl, { timeout: SYNC_TIMEOUT });

            if (response.status === 200) {
                logger.info(`[NODE SYNC] State for contract ${contractId} removed from node ${node.id}`);
            } else {
                logger.warn(`[NODE SYNC] Failed to remove state for contract ${contractId} from node ${node.id}. Response: ${response.data.status}`);
            }
        } catch (error) {
            logger.error(`[NODE SYNC ERROR] Error removing state for contract ${contractId} from node ${node.id}: ${error.message}`);
        }
    }));
};

module.exports = {
    syncStateWithNode,
    syncStateWithNodes,
    reconcileStateAcrossNodes,
    removeStateFromNodes
};
