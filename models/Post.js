'use strict';

const async = require('async');
const appConfig = require('../config/app_config.js');

/**
 * @class Post
 */

class Post {

    /**
     * @constructor
     */
    constructor(sessionData) {
        let self = this;
        self.sessionData = sessionData;
    }

    /**
     * add new post
     */
    addNewPost(postData, callback) {
        let self = this;
        let responseData = [];
        async.waterfall([
            //check author exists in user collection
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
            //add post
            function (waterfallCb) {
                let post = new global.postCollection(postData);
                post.save().then(data => {
                    if (!data) {
                        console.log('Error occured while add post');
                        return waterfallCb('Error occured while add post');
                    }
                    responseData = data;
                    waterfallCb(null);
                }).catch(err => {
                    console.log("Error while inserting post data.", err);
                    return waterfallCb("Error while inserting post data.");
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
    fetchPostDetails(callback) {
        let self = this;
        let responseData = [];
        async.waterfall([
            /**
             * get post data
             */
            function (waterfallCb) {
                global.postCollection.aggregate([
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
                            from: 'comments',
                            localField: '_id',
                            foreignField: 'post',
                            as: 'comments'
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
        });
    }

    /**
     * delete post
     */
    deletePost(postData, callback) {
        let self = this;
        async.waterfall([
            //delete post and comments record followed by requested postId
            function (waterfallCb) {
                try {
                    global.postCollection.remove({
                        _id: postData.id
                    }).exec();
                    global.commentCollection.remove({
                        post: postData.id
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
     * update post
     */
    updatePost(postId, postData, callback) {
        let self = this;
        let responseData = [];
        async.waterfall([
            //update post data
            function (waterfallCb) {
                global.postCollection.findOneAndUpdate({
                        _id: postId
                    },
                    postData, {
                        new: true
                    },
                    (err, data) => {
                        if (err) {
                            console.log("Error while updating post data.", err);
                            return waterfallCb("Error while updating post data.");
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

module.exports = Post;