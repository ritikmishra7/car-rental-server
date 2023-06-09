const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');

const vehicleSchema = mongoose.Schema({
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['car', 'suv', 'van', 'bike'],
        default: 'car',
        required: true,
    },
    registration_number: {
        type: String,
        required: true,
        index: true,
    },
    model: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true
    },
    images: [{
        name: String,
        publicId: String,
        url: String
    }],
    description: {
        type: String,
    },
    fuel: {
        type: String,
        enum: ['petrol', 'diesel', 'electric'],
        required: true,
    },
    transmission: {
        type: String,
        enum: ['manual', 'automatic'],
    },
    mileage: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'unavailable', 'booked'],
        default: 'available'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("vehicle", vehicleSchema);