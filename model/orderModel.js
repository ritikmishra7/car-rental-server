const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vehicle',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    price: {
        type: String,
        required: true
    },
    images: [{
        publicId: String,
        url: String
    }],
    total_price: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    payment_status: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },
    payment_type: {
        type: String,
        enum: ['cash', 'card'],
        default: 'cash'
    },
    payment_id: {
        type: String,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("orders", orderSchema);