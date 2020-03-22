'use strict';

const express = require('express');
const router = express.Router();
const commentModel = require('../models/Comment.js');

/**
 * 
 */
router.post('/add', (req, res) => {
    let self = this;
    let sessionData = req.session;
    let commentModelObj = new commentModel(sessionData);
    commentModelObj.addNewComment(req.body, (err, data) => {
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
    let commentModelObj = new commentModel(sessionData);
    commentModelObj.fetchCommentDetails(function (err, response) {
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
    let commentModelObj = new commentModel(sessionData);
    commentModelObj.deleteComment(req.body, function (err, response) {
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
router.post('/update/:commentId', function (req, res) {
    let sessionData = req.session;
    let commentModelObj = new commentModel(sessionData);
    commentModelObj.updateComment(req.params.commentId, req.body, function (err, response) {
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