const crypto = require('crypto');

// Function to generate a random ID
const generateRandomId = (length = 16) => {
    return crypto.randomBytes(length).toString('hex');
};

// Function to format a date to a readable string (e.g., "2024-10-28 15:30:45")
const formatDate = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Function to validate email addresses using a regular expression
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Function to capitalize the first letter of each word in a string
const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

// Function to debounce a function (to limit how often it runs)
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Function to deep clone an object (avoids issues with shallow copies)
const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

// Function to calculate the difference in days between two dates
const daysBetween = (date1, date2) => {
    const diffTime = Math.abs(date2 - date1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Function to safely access a nested object property (returns undefined if not found)
const getNestedProperty = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

// Function to convert bytes to a human-readable format (e.g., "1.2 MB")
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Function to check if an object is empty
const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
};

// Function to escape HTML (for preventing XSS attacks in user inputs)
const escapeHtml = (str) => {
    return str.replace(/[&<>"']/g, (tag) => {
        const chars = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return chars[tag] || tag;
    });
};

module.exports = {
    generateRandomId,
    formatDate,
    validateEmail,
    capitalizeWords,
    debounce,
    deepClone,
    daysBetween,
    getNestedProperty,
    formatBytes,
    isEmptyObject,
    escapeHtml
};
