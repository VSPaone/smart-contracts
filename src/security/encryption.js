const crypto = require('crypto');
const logger = require('../logging/logger');

// Encryption and decryption configuration
const ALGORITHM = 'aes-256-cbc';
const KEY = crypto.randomBytes(32); // Replace with a securely stored key in production
const IV_LENGTH = 16;

// Function to encrypt data
const encryptData = (data) => {
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const encryptedData = {
            iv: iv.toString('hex'),
            content: encrypted
        };

        logger.info(`[ENCRYPTION] Data encrypted successfully.`);
        return encryptedData;
    } catch (error) {
        logger.error(`[ENCRYPTION ERROR] Failed to encrypt data: ${error.message}`);
        throw error;
    }
};

// Function to decrypt data
const decryptData = (encryptedData) => {
    try {
        const iv = Buffer.from(encryptedData.iv, 'hex');
        const encryptedText = encryptedData.content;
        const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);

        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        logger.info(`[ENCRYPTION] Data decrypted successfully.`);
        return JSON.parse(decrypted);
    } catch (error) {
        logger.error(`[ENCRYPTION ERROR] Failed to decrypt data: ${error.message}`);
        throw error;
    }
};

// Function to encrypt data for transit (e.g., sending data between nodes)
const encryptForTransit = (data) => {
    try {
        return encryptData(data);
    } catch (error) {
        logger.error(`[ENCRYPTION ERROR] Failed to encrypt data for transit: ${error.message}`);
        throw error;
    }
};

// Function to decrypt data received in transit
const decryptFromTransit = (encryptedData) => {
    try {
        return decryptData(encryptedData);
    } catch (error) {
        logger.error(`[ENCRYPTION ERROR] Failed to decrypt data from transit: ${error.message}`);
        throw error;
    }
};

// Exported functions
module.exports = {
    encryptData,
    decryptData,
    encryptForTransit,
    decryptFromTransit
};
