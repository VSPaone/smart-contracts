const dotenv = require('dotenv');
const path = require('path');
const logger = require('../logging/logger');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Default security configuration
const securityConfig = {
    encryptionKey: process.env.ENCRYPTION_KEY || 'default-encryption-key', // Encryption key for data encryption (must be securely stored in production)
    jwtSecret: process.env.JWT_SECRET || 'default-jwt-secret', // Secret key for signing JWT tokens (must be securely stored in production)
    apiKey: process.env.API_KEY || 'default-api-key', // API key for secure communication between nodes or clients
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','), // Comma-separated list of allowed origins for CORS
    rateLimit: {
        windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // Time window in ms (default: 15 minutes)
        maxRequests: process.env.RATE_LIMIT_MAX_REQUESTS || 100 // Max requests allowed per window per IP
    },
    passwordPolicy: {
        minLength: process.env.PASSWORD_MIN_LENGTH || 8, // Minimum password length
        requireNumbers: process.env.PASSWORD_REQUIRE_NUMBERS === 'true', // Whether passwords must contain numbers
        requireSpecialChars: process.env.PASSWORD_REQUIRE_SPECIAL_CHARS === 'true' // Whether passwords must contain special characters
    }
};

// Log the loaded security configuration for debugging purposes
logger.info(`[SECURITY CONFIG] Loaded configuration: ${JSON.stringify(securityConfig)}`);

module.exports = securityConfig;
