'use strict'

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const appConfig = require('./config/app_config.js');

//Declare global variable to re-use through out the app
global.blogConnection = mongoose.createConnection(appConfig.mongoDB.mongoDBURI_blog);

//DB
const userStructure = require('./db/User.js');
const postStructure = require('./db/Post.js');
const commentStructure = require('./db/Comment.js');

/**
 * Schema Defintions
 */
let userSchema = new Schema(userStructure);
global.userCollection = global.blogConnection.model('users', userSchema);

let postSchema = new Schema(postStructure);
global.postCollection = global.blogConnection.model('posts', postSchema);

let commentSchema = new Schema(commentStructure);
global.commentCollection = global.blogConnection.model('comments', commentSchema);

global.ObjectId = mongoose.Types.ObjectId;

app.use(function (req, res, next) {
    var allowOrigin = req.headers.origin || "*";
    res.setHeader("Access-Control-Allow-Origin", allowOrigin);
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    "extended": false
}));

//all routes are handled here
app.use(require('./controllers'));

/**
 * Default handler for uncaught exception error.
 **/
app.use(function (err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    console.log(err);
    res.status(200).json({
        "responseCode": 1,
        "responseDesc": 'Error Occured'
    })
});

module.exports = app;