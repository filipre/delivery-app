const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    _id: String,
    created: Number,
    customer: String,
    address: String,
    status: String,
    status_history: [{
        _id: false,
        date: Number,
        status: String,
    }],
    location: {
        _id: false,
        lat: Number,
        long: Number,
    },
    location_history: [{
        _id: false,
        date: Number,
        lat: Number,
        long: Number,
    }],
    rider: String,
    deleted: Boolean,
});

module.exports = mongoose.model('Shipment', dataSchema, 'shipment')