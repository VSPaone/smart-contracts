const mongoose = require('mongoose');

// Define the schema for smart contracts
const contractSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    conditions: {
        type: Array,
        required: true,
        // Each condition could have a type, value, and comparator (e.g., { field: "balance", operator: ">=", value: 100 })
        default: []
    },
    actions: {
        type: Array,
        required: true,
        // Actions could include details like actionType, target, value, etc.
        default: []
    },
    state: {
        type: String,
        enum: ['active', 'inactive', 'completed', 'failed'],
        default: 'inactive'
    },
    timestamps: {
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        executedAt: {
            type: Date
        }
    }
});

// Pre-save hook to update the `updatedAt` timestamp before saving
contractSchema.pre('save', function (next) {
    this.timestamps.updatedAt = Date.now();
    next();
});

// Create a model from the schema
const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
