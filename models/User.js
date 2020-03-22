'use strict';

const async = require('async');
const appConfig = require('../config/app_config.js');

/**
 * @class User
 **/

class User {
    /**
     * @constructor
     **/
    constructor(sessionData) {
        let self = this;
        self.sessionData = sessionData;
    }

    /**
     * Add new user
     * @param {*} callback 
     */
    addUserData(postData, callback) {
        let self = this;
        let responseData = [];
        async.waterfall([
            //check email is already exists
            function (waterfallCb) {
                global.userCollection.find({
                    email: postData.email
                }, (err, result) => {
                    if (err) {
                        console.log("Error while fetching user list.", err);
                        return waterfallCb("Error while fetching user list.");
                    }
                    if (result.length > 0) {
                        return waterfallCb("Email is already exists.");
                    }
                    console.log(result);
                    waterfallCb(null);
                });
            },
            //add user data
            function (waterfallCb) {
                let user = new global.userCollection(postData);
                user.save().then((result) => {
                    if (!result) {
                        console.log('Error occured while add user');
                        return waterfallCb('Error occured while add user');
                    }
                    responseData = result;
                    waterfallCb(null);
                }).catch((err) => {
                    console.log("Error while inserting user data.", err);
                    return waterfallCb("Error while inserting user data.");
                });
            }
        ], (err) => {
            if (err) {
                return callback(err);
            }
            callback(null, responseData);
        });
    }

    /**
     * Fetch all users details
     **/
    fetchUserDetails(callback) {
        let self = this;
        let responseData = [];
        async.waterfall([
            //get user details
            function (waterfallCb) {
                global.userCollection.aggregate([
                    // {
                    // 	$match: {
                    // 		_id: global.ObjectId("5e4a6dad29dd304940cda81d")
                    // 	}
                    // },
                    {
                        $lookup: {
                            from: 'posts',
                            localField: '_id',
                            foreignField: 'user',
                            as: 'posts'
                        }
                    }
                ], (err, data) => {
                    if (err) {
                        console.log("Error while fetching user list.", err);
                        return waterfallCb("Error while fetching user list.");
                    }
                    console.log(data);
                    responseData = data;
                    waterfallCb(null);
                });
            }
        ], err => {
            if (err) {
                return callback(err);
            }
            callback(null, responseData);
        });
    }

    /**
     * Fetch all users details
     **/
    fetchUserPagination(pageNo, size, callback) {
        let self = this;
        let responseData = [];
        let query = {};
        query.skip = parseInt(size * (pageNo - 1));
        query.limit = parseInt(size);
        async.waterfall([
            /** fetch Data */
            function (waterfallCb) {
                global.userCollection.find({}, {}, query, (err, result) => {
                    if (err) {
                        console.log("Error while fetching user list.", err)
                        return waterfallCb("Error while fetching user list.")
                    }
                    responseData = result;
                    waterfallCb(null);
                });
            }
        ], (err) => {
            if (err) {
                return callback(err)
            }
            callback(null, responseData);
        });
    }

    /**
     * Delete User
     */
    deleteUserData(postData, callback) {
        let self = this;
        async.waterfall([
            //delete user, post and comments record followed by requested userId
            function (waterfallCb) {
                try {
                    global.userCollection.remove({
                        _id: postData.id
                    }).exec();
                    global.postCollection.remove({
                        user: postData.id
                    }).exec();
                    global.commentCollection.remove({
                        user: postData.id
                    }).exec();
                    waterfallCb(null);
                } catch (err) {
                    console.log("Error while deleting user data.", err);
                    return waterfallCb("Error while deleting user data.");
                }
            }
        ], err => {
            if (err) {
                return callback(err);
            }
            callback(null);
        })
    }

    /**
     * Update User
     */
    updateUserData(userId, postData, callback) {
        let self = this;
        let responseData = [];
        async.waterfall([
            //If email changes check whether the email is already exists or not
            function (waterfallCb) {
                if (!postData.email) {
                    return waterfallCb(null);
                }
                global.userCollection.find({
                    email: postData.email
                }, (err, result) => {
                    if (err) {
                        console.log("Error while fetching user list.", err);
                        return waterfallCb("Error while fetching user list.");
                    }
                    if (result.length > 0) {
                        return waterfallCb("Email is already exists.");
                    }
                    console.log(result);
                    waterfallCb(null);
                });
            },
            //find and updated the record
            function (waterfallCb) {
                global.userCollection.findOneAndUpdate({
                    _id: userId
                }, postData, {
                    new: true
                }, (err, data) => {
                    if (err) {
                        console.log("Error while updating user data.", err);
                        return waterfallCb("Error while updating user data.");
                    }
                    responseData = data;
                    waterfallCb(null);
                });
            }
        ], err => {
            if (err) {
                return callback(err);
            }
            callback(null, responseData);
        })
    }
}

module.exports = User;