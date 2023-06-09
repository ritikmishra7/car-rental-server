const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    avatar: {
        publicId: String,
        url: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("user", userSchema);