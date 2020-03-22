const express = require('express'),
    router = express.Router();

router.use('/user', require('./user'));
router.use('/post', require('./post'));
router.use('/comment', require('./comments'));

module.exports = router;