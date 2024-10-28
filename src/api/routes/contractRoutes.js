const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to create a new contract
router.post('/contracts', authMiddleware, async (req, res) => {
    try {
        const newContract = await contractController.createContract(req.body);
        res.status(201).json(newContract);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to get a list of all contracts
router.get('/contracts', authMiddleware, async (req, res) => {
    try {
        const contracts = await contractController.getAllContracts();
        res.status(200).json(contracts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to get a specific contract by ID
router.get('/contracts/:id', authMiddleware, async (req, res) => {
    try {
        const contract = await contractController.getContractById(req.params.id);
        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }
        res.status(200).json(contract);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to update a specific contract by ID
router.put('/contracts/:id', authMiddleware, async (req, res) => {
    try {
        const updatedContract = await contractController.updateContract(req.params.id, req.body);
        if (!updatedContract) {
            return res.status(404).json({ error: 'Contract not found or update failed' });
        }
        res.status(200).json(updatedContract);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to delete a specific contract by ID
router.delete('/contracts/:id', authMiddleware, async (req, res) => {
    try {
        const deleted = await contractController.deleteContract(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Contract not found or delete failed' });
        }
        res.status(200).json({ message: 'Contract deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
