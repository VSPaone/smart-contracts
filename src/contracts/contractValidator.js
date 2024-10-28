const Contract = require('./contractModel');

// Function to validate a new contract before saving it
const validateContract = (contractData) => {
    const errors = [];

    // Validate the contract name
    if (!contractData.name || typeof contractData.name !== 'string') {
        errors.push('Invalid contract name: must be a non-empty string.');
    }

    // Validate conditions array
    if (!Array.isArray(contractData.conditions) || contractData.conditions.length === 0) {
        errors.push('Invalid conditions: must be a non-empty array.');
    } else {
        // Validate each condition object
        contractData.conditions.forEach((condition, index) => {
            if (!condition.field || typeof condition.field !== 'string') {
                errors.push(`Invalid field in condition at index ${index}: must be a string.`);
            }
            if (!condition.operator || !['==', '!=', '>', '>=', '<', '<='].includes(condition.operator)) {
                errors.push(`Invalid operator in condition at index ${index}: must be one of '==', '!=', '>', '>=', '<', '<='.`);
            }
            if (condition.value === undefined) {
                errors.push(`Invalid value in condition at index ${index}: value is required.`);
            }
        });
    }

    // Validate actions array
    if (!Array.isArray(contractData.actions) || contractData.actions.length === 0) {
        errors.push('Invalid actions: must be a non-empty array.');
    } else {
        // Validate each action object
        contractData.actions.forEach((action, index) => {
            if (!action.type || typeof action.type !== 'string') {
                errors.push(`Invalid action type at index ${index}: must be a string.`);
            }
            // Additional validation for action parameters can be added here
        });
    }

    // Validate state (optional, if provided)
    if (contractData.state && !['active', 'inactive', 'completed', 'failed'].includes(contractData.state)) {
        errors.push('Invalid state: must be one of "active", "inactive", "completed", or "failed".');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Function to validate contract before execution
const validateContractExecution = async (contractId) => {
    try {
        const contract = await Contract.findById(contractId);
        if (!contract) {
            return { isValid: false, errors: ['Contract not found.'] };
        }

        // Validate contract state
        if (contract.state !== 'active') {
            return { isValid: false, errors: ['Contract must be active for execution.'] };
        }

        // Additional validation logic for conditions can be added here

        return { isValid: true, errors: [] };
    } catch (err) {
        return { isValid: false, errors: ['Error validating contract execution.'] };
    }
};

module.exports = {
    validateContract,
    validateContractExecution
};
