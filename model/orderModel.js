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
    total_price: {
        type: String,
        required: true
    },
    license_number: {
        type: String,
    },
    receipt: {
        type: String,
    },
    // status: {
    //     type: String,
    //     enum: ['pending', 'approved', 'rejected'],
    //     default: 'pending'
    // },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    date_of_booking: {
        type: String,
        required: true
    },
    date_of_return: {
        type: String,
        required: true
    },
    payment_status: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },
    order_id: {
        type: String,
        required: true,
        index: true
    },
    payment_id: {
        type: String,
    },
    signature: {
        type: String,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("orders", orderSchema);