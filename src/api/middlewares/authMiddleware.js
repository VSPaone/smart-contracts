const authentication = require('../security/authentication');
const logger = require('../logging/logger');

// Middleware function to authenticate API requests
const authMiddleware = async (req, res, next) => {
    try {
        // Extract the token from the request header (e.g., 'Authorization: Bearer <token>')
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            logger.warn('[AUTH MIDDLEWARE] No authorization token provided.');
            return res.status(401).json({ error: 'Unauthorized access. No token provided.' });
        }

        // Extract the token from the 'Authorization' header
        const token = authHeader.split(' ')[1];

        // Verify the token using the authentication module
        const decodedToken = await authentication.verifyToken(token);

        // If token verification fails, return an error
        if (!decodedToken) {
            logger.warn('[AUTH MIDDLEWARE] Invalid or expired token.');
            return res.status(401).json({ error: 'Unauthorized access. Invalid or expired token.' });
        }

        // Attach the decoded token data (e.g., user or node information) to the request object
        req.user = decodedToken;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        logger.error(`[AUTH MIDDLEWARE ERROR] Authentication failed: ${error.message}`);
        res.status(500).json({ error: 'Internal server error during authentication.' });
    }
};

module.exports = authMiddleware;
