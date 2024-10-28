const eventListener = require('../events/eventListener');
const eventProcessor = require('../events/eventProcessor');
const logger = require('../logging/logger');

// Function to trigger a new event
const triggerEvent = async (eventData) => {
    try {
        // Process the event before triggering it
        const processedEvent = await eventProcessor.processEvent(eventData);

        // Trigger the event via the eventListener
        const triggeredEvent = await eventListener.trigger(processedEvent);
        logger.info(`[EVENT CONTROLLER] Event triggered successfully with ID: ${triggeredEvent.id}`);

        return triggeredEvent;
    } catch (error) {
        logger.error(`[EVENT CONTROLLER ERROR] Failed to trigger event: ${error.message}`);
        throw error;
    }
};

// Function to get all events
const getAllEvents = async () => {
    try {
        const events = await eventListener.getAllEvents();
        logger.info(`[EVENT CONTROLLER] Retrieved ${events.length} events.`);
        return events;
    } catch (error) {
        logger.error(`[EVENT CONTROLLER ERROR] Failed to retrieve events: ${error.message}`);
        throw error;
    }
};

// Function to get a specific event by ID
const getEventById = async (eventId) => {
    try {
        const event = await eventListener.getEventById(eventId);
        if (!event) {
            logger.warn(`[EVENT CONTROLLER] Event with ID: ${eventId} not found.`);
            return null;
        }
        logger.info(`[EVENT CONTROLLER] Event with ID: ${eventId} retrieved.`);
        return event;
    } catch (error) {
        logger.error(`[EVENT CONTROLLER ERROR] Failed to retrieve event with ID: ${eventId} - ${error.message}`);
        throw error;
    }
};

// Function to update an event's details
const updateEvent = async (eventId, updateData) => {
    try {
        const updatedEvent = await eventListener.updateEvent(eventId, updateData);
        if (!updatedEvent) {
            logger.warn(`[EVENT CONTROLLER] Event with ID: ${eventId} not found for update.`);
            return null;
        }

        logger.info(`[EVENT CONTROLLER] Event with ID: ${eventId} updated successfully.`);
        return updatedEvent;
    } catch (error) {
        logger.error(`[EVENT CONTROLLER ERROR] Failed to update event with ID: ${eventId} - ${error.message}`);
        throw error;
    }
};

// Function to delete an event by ID
const deleteEvent = async (eventId) => {
    try {
        const deleted = await eventListener.deleteEvent(eventId);
        if (!deleted) {
            logger.warn(`[EVENT CONTROLLER] Event with ID: ${eventId} not found for deletion.`);
            return null;
        }

        logger.info(`[EVENT CONTROLLER] Event with ID: ${eventId} deleted successfully.`);
        return true;
    } catch (error) {
        logger.error(`[EVENT CONTROLLER ERROR] Failed to delete event with ID: ${eventId} - ${error.message}`);
        throw error;
    }
};

module.exports = {
    triggerEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
};
