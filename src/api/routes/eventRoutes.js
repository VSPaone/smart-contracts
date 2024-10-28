const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to trigger a new event
router.post('/events/trigger', authMiddleware, async (req, res) => {
    try {
        const eventData = req.body;
        const triggeredEvent = await eventController.triggerEvent(eventData);
        res.status(201).json(triggeredEvent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to get a list of all events
router.get('/events', authMiddleware, async (req, res) => {
    try {
        const events = await eventController.getAllEvents();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to get a specific event by ID
router.get('/events/:id', authMiddleware, async (req, res) => {
    try {
        const event = await eventController.getEventById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to update an event's details by ID
router.put('/events/:id', authMiddleware, async (req, res) => {
    try {
        const updatedEvent = await eventController.updateEvent(req.params.id, req.body);
        if (!updatedEvent) {
            return res.status(404).json({ error: 'Event not found or update failed' });
        }
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to delete an event by ID
router.delete('/events/:id', authMiddleware, async (req, res) => {
    try {
        const deleted = await eventController.deleteEvent(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Event not found or delete failed' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
