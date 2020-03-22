'use strict';

const async = require('async');
const appConfig = require('../config/app_config.js');

/**
 * @class Comment
 */

class Comment {

    /**
     * @constructor
     */
    constructor(sessionData) {
        let self = this;
        self.sessionData = sessionData;
    }

    /**
     * add new comment
     */
    addNewComment(postData, callback) {
        let self = this;
        let responseData = [];
        async.waterfall([
            // check user exists
            function (waterfallCb) {
                global.userCollection.find({
                    _id: postData.user
                }).then(data => {
                    console.log(data);
                    if (!data || data.length === 0) {
                        console.log('User not found.');
                        return waterfallCb('User not found.');
                    }
                    waterfallCb(null);
                }).catch(err => {
                    console.log('Error while fetching user data.');
                    return waterfallCb('Error while fetching user data.');
                });
            },
            //check post exists
            function (waterfallCb) {
                global.postCollection.find({
                    _id: postData.post
                }).then(data => {
                    console.log(data);
                    if (!data || data.length === 0) {
                        console.log('Post not found.');
                        return waterfallCb('Post not found.');
                    }
                    waterfallCb(null);
                }).catch(err => {
                    console.log('Error while fetching post data.');
                    return waterfallCb('Error while fetching post data.');
                });
            },
            //add comment
            function (waterfallCb) {
                let comment = new global.commentCollection(postData);
                comment.save().then(data => {
                    if (!data) {
                        console.log('Error occured while add comment');
                        return waterfallCb('Error occured while add comment');
                    }
                    responseData = data;
                    waterfallCb(null);
                }).catch(err => {
                    console.log("Error while inserting comment data.", err);
                    return waterfallCb("Error while inserting comment data.");
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
     * 
     */
    fetchCommentDetails(callback) {
        let self = this;
        let responseData = [];
        async.waterfall([
            /**
             * fetch comments data
             */
            function (waterfallCb) {
                global.commentCollection.aggregate([
                    // {
                    // 	$match: {
                    // 		_id: global.ObjectId("5e4a6dad29dd304940cda81d")
                    // 	}
                    // },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'user',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                    {
                        $lookup: {
                            from: 'posts',
                            localField: 'post',
                            foreignField: '_id',
                            as: 'posts'
                        }
                    }
                ], (err, data) => {
                    if (err) {
                        console.log("Error while fetching post list.", err);
                        return waterfallCb("Error while fetching post list.");
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
        })
    }

    /**
     * delete comment
     */
    deleteComment(postData, callback) {
        let self = this;
        async.waterfall([
            //delete comments record followed by requested commentId
            function (waterfallCb) {
                try {
                    global.commentCollection.remove({
                        _id: postData.id
                    }).exec();
                    waterfallCb(null);
                } catch (err) {
                    console.log("Error while deleting post data.", err);
                    return waterfallCb("Error while deleting post data.");
                }
            }
        ], err => {
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    }

    /**
     * update comment
     */
    updateComment(commentId, postData, callback) {
        let self = this;
        let responseData = [];
        async.waterfall([
            //update post data
            function (waterfallCb) {
                global.commentCollection.findOneAndUpdate({
                        _id: commentId
                    },
                    postData, {
                        new: true
                    },
                    (err, data) => {
                        if (err) {
                            console.log("Error while updating comment data.", err);
                            return waterfallCb("Error while updating comment data.");
                        }
                        responseData = data;
                        waterfallCb(null);
                    }
                );
            }
        ], err => {
            if (err) {
                return callback(err);
            }
            callback(null, responseData);
        });
    }
}

module.exports = Comment;