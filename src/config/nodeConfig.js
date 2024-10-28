const dotenv = require('dotenv');
const path = require('path');
const logger = require('../logging/logger');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Default node configuration (if not provided in the environment variables)
const DEFAULT_NODE_PORT = 3000;
const DEFAULT_NODE_IP = '127.0.0.1';

// Node configuration
const nodeConfig = {
    nodeId: process.env.NODE_ID || `node-${Math.floor(Math.random() * 1000)}`,
    nodeIp: process.env.NODE_IP || DEFAULT_NODE_IP,
    nodePort: process.env.NODE_PORT || DEFAULT_NODE_PORT,
    apiKey: process.env.NODE_API_KEY || 'default-node-api-key', // API key for authenticating nodes
    maxConnections: process.env.MAX_CONNECTIONS || 100, // Maximum allowed connections for the node
    heartbeatInterval: process.env.HEARTBEAT_INTERVAL || 60000, // Interval for heartbeat checks in ms (default: 60 seconds)
    syncInterval: process.env.SYNC_INTERVAL || 300000 // Interval for state synchronization in ms (default: 5 minutes)
};

// Log the loaded configuration for debugging purposes
logger.info(`[NODE CONFIG] Loaded configuration: ${JSON.stringify(nodeConfig)}`);

module.exports = nodeConfig;
