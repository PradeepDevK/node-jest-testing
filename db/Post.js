'use strict';

const mongoose = require('mongoose');

module.exports = {
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: false
    },
    published: {
        type: Boolean,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    }]
};