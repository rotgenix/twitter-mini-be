const express = require("express");

const { isAuthenticated } = require("../config/auth.js");

const { createTweet, deleteTweet, likeOrDislike, getAllTweets, getFollowingTweets } = require("../controllers/tweetController.js");

const router = express.Router();

router.post('/create', isAuthenticated, createTweet);
router.delete('/delete/:tweetId', isAuthenticated, deleteTweet);
router.patch('/like/:id', isAuthenticated, likeOrDislike);
router.get('/get-all-tweets', isAuthenticated, getAllTweets);
router.get('/get-following-tweets', isAuthenticated, getFollowingTweets);

module.exports = router;