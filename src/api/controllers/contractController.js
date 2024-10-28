const contractModel = require('../models/contractModel');
const contractValidator = require('../validators/contractValidator');
const contractExecutor = require('../executors/contractExecutor');
const logger = require('../logging/logger');

// Function to create a new contract
const createContract = async (contractData) => {
    try {
        // Validate the contract data
        const validationResult = contractValidator.validate(contractData);
        if (!validationResult.isValid) {
            throw new Error(`Validation error: ${validationResult.message}`);
        }

        // Save the contract to the database
        const newContract = await contractModel.create(contractData);
        logger.info(`[CONTRACT CONTROLLER] Contract created successfully with ID: ${newContract.id}`);

        // Optionally execute the contract upon creation if auto-execution is enabled
        if (contractData.autoExecute) {
            await contractExecutor.execute(newContract);
        }

        return newContract;
    } catch (error) {
        logger.error(`[CONTRACT CONTROLLER ERROR] Failed to create contract: ${error.message}`);
        throw error;
    }
};

// Function to get all contracts
const getAllContracts = async () => {
    try {
        const contracts = await contractModel.find();
        logger.info(`[CONTRACT CONTROLLER] Retrieved ${contracts.length} contracts.`);
        return contracts;
    } catch (error) {
        logger.error(`[CONTRACT CONTROLLER ERROR] Failed to retrieve contracts: ${error.message}`);
        throw error;
    }
};

// Function to get a specific contract by ID
const getContractById = async (contractId) => {
    try {
        const contract = await contractModel.findById(contractId);
        if (!contract) {
            logger.warn(`[CONTRACT CONTROLLER] Contract with ID: ${contractId} not found.`);
            return null;
        }
        logger.info(`[CONTRACT CONTROLLER] Contract with ID: ${contractId} retrieved.`);
        return contract;
    } catch (error) {
        logger.error(`[CONTRACT CONTROLLER ERROR] Failed to retrieve contract with ID: ${contractId} - ${error.message}`);
        throw error;
    }
};

// Function to update a specific contract by ID
const updateContract = async (contractId, updateData) => {
    try {
        // Validate the update data
        const validationResult = contractValidator.validate(updateData);
        if (!validationResult.isValid) {
            throw new Error(`Validation error: ${validationResult.message}`);
        }

        const updatedContract = await contractModel.findByIdAndUpdate(contractId, updateData, { new: true });
        if (!updatedContract) {
            logger.warn(`[CONTRACT CONTROLLER] Contract with ID: ${contractId} not found for update.`);
            return null;
        }

        logger.info(`[CONTRACT CONTROLLER] Contract with ID: ${contractId} updated successfully.`);
        return updatedContract;
    } catch (error) {
        logger.error(`[CONTRACT CONTROLLER ERROR] Failed to update contract with ID: ${contractId} - ${error.message}`);
        throw error;
    }
};

// Function to delete a specific contract by ID
const deleteContract = async (contractId) => {
    try {
        const deletedContract = await contractModel.findByIdAndDelete(contractId);
        if (!deletedContract) {
            logger.warn(`[CONTRACT CONTROLLER] Contract with ID: ${contractId} not found for deletion.`);
            return null;
        }

        logger.info(`[CONTRACT CONTROLLER] Contract with ID: ${contractId} deleted successfully.`);
        return true;
    } catch (error) {
        logger.error(`[CONTRACT CONTROLLER ERROR] Failed to delete contract with ID: ${contractId} - ${error.message}`);
        throw error;
    }
};

// Function to execute a specific contract by ID
const executeContract = async (contractId) => {
    try {
        const contract = await contractModel.findById(contractId);
        if (!contract) {
            logger.warn(`[CONTRACT CONTROLLER] Contract with ID: ${contractId} not found for execution.`);
            return null;
        }

        const executionResult = await contractExecutor.execute(contract);
        logger.info(`[CONTRACT CONTROLLER] Contract with ID: ${contractId} executed successfully.`);
        return executionResult;
    } catch (error) {
        logger.error(`[CONTRACT CONTROLLER ERROR] Failed to execute contract with ID: ${contractId} - ${error.message}`);
        throw error;
    }
};

module.exports = {
    createContract,
    getAllContracts,
    getContractById,
    updateContract,
    deleteContract,
    executeContract
};
