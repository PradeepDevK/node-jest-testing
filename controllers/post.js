'use strict';

const express = require('express');
const router = express.Router();
const postModel = require('../models/Post.js');

/**
 * 
 */
router.post('/add', (req, res) => {
    let self = this;
    let sessionData = req.session;
    let postModelObj = new postModel(sessionData);
    postModelObj.addNewPost(req.body, (err, data) => {
        if (err) {
            return res.json({
                'responseCode': 1,
                'responseDesc': err,
                'data': []
            });
        }
        return res.json({
            "responseCode": 0,
            "responseDesc": "Success",
            "data": data || []
        });
    })
});

/**
 * 
 */
router.get('/fetch', function (req, res) {
    let sessionData = req.session;
    let postModelObj = new postModel(sessionData);
    postModelObj.fetchPostDetails(function (err, response) {
        if (err) {
            return res.json({
                'responseCode': 1,
                'responseDesc': err,
                'data': []
            });
        }
        return res.json({
            "responseCode": 0,
            "responseDesc": "Success",
            "data": response || []
        });
    });
});

/**
 * 
 */
router.post('/delete', function (req, res) {
    let sessionData = req.session;
    let postModelObj = new postModel(sessionData);
    postModelObj.deletePost(req.body, function (err, response) {
        if (err) {
            return res.json({
                'responseCode': 1,
                'responseDesc': err,
                'data': []
            });
        }
        return res.json({
            "responseCode": 0,
            "responseDesc": "Success",
            "data": response || []
        });
    });
});

/**
 * 
 */
router.post('/update/:postId', function (req, res) {
    let sessionData = req.session;
    let postModelObj = new postModel(sessionData);
    postModelObj.updatePost(req.params.postId, req.body, function (err, response) {
        if (err) {
            return res.json({
                'responseCode': 1,
                'responseDesc': err,
                'data': []
            });
        }
        return res.json({
            "responseCode": 0,
            "responseDesc": "Success",
            'data': response || []
        });
    });
});

module.exports = router;