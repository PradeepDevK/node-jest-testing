'use strict';

const express = require('express');
const router = express.Router();
const userModel = require('../models/User.js');

/**
 * Add new user
 */
router.post('/add', (req, res) => {
    let self = this;
    let sessionData = req.session;
    let userModelObj = new userModel(sessionData);
    userModelObj.addUserData(req.body, (err, response) => {
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
    })

});

router.get('/fetch', function (req, res) {
    let sessionData = req.session;
    let userModelObj = new userModel(sessionData);
    userModelObj.fetchUserDetails(function (err, response) {
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

router.post('/delete', function (req, res) {
    let sessionData = req.session;
    let userModelObj = new userModel(sessionData);
    userModelObj.deleteUserData(req.body, function (err, response) {
        if (err) {
            return res.json({
                'responseCode': 1,
                'responseDesc': err,
                'data': []
            });
        }
        return res.json({
            "responseCode": 0,
            "responseDesc": "Success"
        });
    });
});

router.post('/update/:userId', function (req, res) {
    let sessionData = req.session;
    let userModelObj = new userModel(sessionData);
    userModelObj.updateUserData(req.params.userId, req.body, function (err, response) {
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

router.get('/user/pagination/:pageNo/:size', function (req, res) {
    let sessionData = req.session;
    let userModelObj = new userModel(sessionData);
    let pageNo = req.params.pageNo;
    let size = req.params.size;
    if (pageNo < 0 || pageNo === 0) {
        return res.json({
            'responseCode': 1,
            'responseDesc': "Invalid Page No"
        });
    }
    userModelObj.fetchUserPagination(pageNo, size, function (err, response) {
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

module.exports = router;