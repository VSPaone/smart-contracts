const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const logger = require('../logging/logger');
const authorization = require('./authorization');

// Configuration constants
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Should be stored securely in an environment variable
const JWT_EXPIRATION = '1h'; // Token expiration time

// Function to register a new user
const registerUser = async (username, password) => {
    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user details (in a real scenario, this would involve saving to a database)
        const user = {
            username,
            password: hashedPassword,
            roles: ['user'] // Default role for a new user
        };

        logger.info(`[AUTHENTICATION] User ${username} registered successfully.`);
        return user;
    } catch (error) {
        logger.error(`[AUTHENTICATION ERROR] Error registering user ${username}: ${error.message}`);
        throw error;
    }
};

// Function to authenticate a user
const authenticateUser = async (username, password, usersDb) => {
    try {
        // Find the user in the database (usersDb is a placeholder for the user database)
        const user = usersDb.find((u) => u.username === username);
        if (!user) {
            logger.warn(`[AUTHENTICATION] User ${username} not found.`);
            return null;
        }

        // Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.warn(`[AUTHENTICATION] Invalid password for user ${username}.`);
            return null;
        }

        // Generate a JWT token
        const token = jwt.sign(
            { username: user.username, roles: user.roles },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        logger.info(`[AUTHENTICATION] User ${username} authenticated successfully.`);
        return { token, user };
    } catch (error) {
        logger.error(`[AUTHENTICATION ERROR] Error authenticating user ${username}: ${error.message}`);
        throw error;
    }
};

// Function to verify a JWT token
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        logger.info(`[AUTHENTICATION] Token verified successfully.`);
        return decoded;
    } catch (error) {
        logger.error(`[AUTHENTICATION ERROR] Invalid token: ${error.message}`);
        return null;
    }
};

// Function to authenticate nodes using API keys
const authenticateNode = (apiKey, nodesDb) => {
    try {
        // Find the node using the provided API key (nodesDb is a placeholder for the node database)
        const node = nodesDb.find((n) => n.apiKey === apiKey);
        if (!node) {
            logger.warn(`[AUTHENTICATION] Node with API key ${apiKey} not found.`);
            return null;
        }

        logger.info(`[AUTHENTICATION] Node ${node.id} authenticated successfully.`);
        return node;
    } catch (error) {
        logger.error(`[AUTHENTICATION ERROR] Error authenticating node: ${error.message}`);
        return null;
    }
};

// Function to authorize a user based on their roles
const authorizeUser = (user, requiredRole) => {
    try {
        const hasAccess = authorization.checkRoleAccess(user.roles, requiredRole);
        if (hasAccess) {
            logger.info(`[AUTHORIZATION] User ${user.username} authorized for role ${requiredRole}.`);
            return true;
        } else {
            logger.warn(`[AUTHORIZATION] User ${user.username} does not have access for role ${requiredRole}.`);
            return false;
        }
    } catch (error) {
        logger.error(`[AUTHORIZATION ERROR] Error authorizing user ${user.username}: ${error.message}`);
        return false;
    }
};

// Function to refresh a JWT token
const refreshToken = (token) => {
    try {
        const decoded = verifyToken(token);
        if (!decoded) {
            return null;
        }

        // Generate a new token with the same payload but a new expiration
        const newToken = jwt.sign(
            { username: decoded.username, roles: decoded.roles },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        logger.info(`[AUTHENTICATION] Token refreshed successfully.`);
        return newToken;
    } catch (error) {
        logger.error(`[AUTHENTICATION ERROR] Error refreshing token: ${error.message}`);
        return null;
    }
};

module.exports = {
    registerUser,
    authenticateUser,
    verifyToken,
    authenticateNode,
    authorizeUser,
    refreshToken
};
