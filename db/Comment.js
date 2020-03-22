'use strict';

const mongoose = require('mongoose');

module.exports = {
    text: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'
    }
};