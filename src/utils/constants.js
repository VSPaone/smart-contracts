// Application-wide constants
const constants = {
    // API and Server Configuration
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api',
    DEFAULT_PORT: process.env.PORT || 3000,
    
    // Security and Authentication
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1h', // Token expiration time
    ENCRYPTION_ALGORITHM: 'aes-256-cbc', // Encryption algorithm for data security
    SALT_ROUNDS: 10, // Salt rounds for password hashing (bcrypt)

    // Contract-related constants
    CONTRACT_STATUSES: {
        PENDING: 'PENDING',
        ACTIVE: 'ACTIVE',
        COMPLETED: 'COMPLETED',
        EXPIRED: 'EXPIRED',
        FAILED: 'FAILED'
    },
    DEFAULT_CONTRACT_VALIDATION_INTERVAL: 3600, // in seconds (1 hour)

    // Event-related constants
    EVENT_TYPES: {
        CONTRACT_EXECUTION: 'CONTRACT_EXECUTION',
        STATE_SYNC: 'STATE_SYNC',
        NODE_HEALTH_CHECK: 'NODE_HEALTH_CHECK'
    },
    DEFAULT_EVENT_PROCESSING_INTERVAL: 600, // in seconds (10 minutes)

    // Node Management
    DEFAULT_NODE_STATUS: 'ACTIVE',
    NODE_HEALTH_CHECK_INTERVAL: 300, // in seconds (5 minutes)
    MAX_NODE_CONNECTIONS: process.env.MAX_NODE_CONNECTIONS || 100, // Max allowed connections per node

    // State Management
    STATE_SYNC_INTERVAL: process.env.STATE_SYNC_INTERVAL || 300, // in seconds (5 minutes)
    MAX_STATE_HISTORY: 100, // Maximum number of state changes stored per node

    // Logging
    LOG_LEVELS: {
        INFO: 'info',
        WARN: 'warn',
        ERROR: 'error',
        DEBUG: 'debug'
    },
    LOG_DIRECTORY: process.env.LOG_DIRECTORY || './logs',

    // Rate Limiting
    RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes in milliseconds
    RATE_LIMIT_MAX_REQUESTS: 100, // Max requests per window per IP

    // Error Codes
    ERROR_CODES: {
        VALIDATION_ERROR: 'VALIDATION_ERROR',
        AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
        AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
        NOT_FOUND: 'NOT_FOUND',
        SERVER_ERROR: 'SERVER_ERROR'
    },

    // Data Formats
    DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss', // Standard date format for logs and responses
    BYTES_FORMATS: ['Bytes', 'KB', 'MB', 'GB', 'TB'],

    // Miscellaneous
    SUPPORTED_LANGUAGES: ['en', 'es', 'fr', 'de'], // Supported languages for i18n
    DEFAULT_LANGUAGE: 'en',
    MAX_LOG_SIZE: 5 * 1024 * 1024, // Max log file size (5MB)
    DEFAULT_RETRY_COUNT: 3, // Default retry count for failed operations
    CACHE_TTL: 3600 // Default cache time-to-live in seconds (1 hour)
};

module.exports = constants;
