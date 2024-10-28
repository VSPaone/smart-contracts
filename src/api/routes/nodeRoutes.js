const express = require('express');
const router = express.Router();
const nodeController = require('../controllers/nodeController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to register a new node
router.post('/nodes/register', authMiddleware, async (req, res) => {
    try {
        const newNode = await nodeController.registerNode(req.body);
        res.status(201).json(newNode);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to get a list of all registered nodes
router.get('/nodes', authMiddleware, async (req, res) => {
    try {
        const nodes = await nodeController.getAllNodes();
        res.status(200).json(nodes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to check the health status of a specific node by ID
router.get('/nodes/:id/health', authMiddleware, async (req, res) => {
    try {
        const healthStatus = await nodeController.checkNodeHealth(req.params.id);
        if (!healthStatus) {
            return res.status(404).json({ error: 'Node not found' });
        }
        res.status(200).json(healthStatus);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to update a node's details (e.g., IP address, status)
router.put('/nodes/:id', authMiddleware, async (req, res) => {
    try {
        const updatedNode = await nodeController.updateNode(req.params.id, req.body);
        if (!updatedNode) {
            return res.status(404).json({ error: 'Node not found or update failed' });
        }
        res.status(200).json(updatedNode);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to delete a node by ID
router.delete('/nodes/:id', authMiddleware, async (req, res) => {
    try {
        const deleted = await nodeController.deleteNode(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Node not found or delete failed' });
        }
        res.status(200).json({ message: 'Node deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to check the overall health status of the system (e.g., all nodes)
router.get('/nodes/health', authMiddleware, async (req, res) => {
    try {
        const overallHealthStatus = await nodeController.getSystemHealth();
        res.status(200).json(overallHealthStatus);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
