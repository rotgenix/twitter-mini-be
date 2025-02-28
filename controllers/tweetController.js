const Tweet = require("../models/tweetSchema");
const User = require("../models/userSchema");

const createTweet = async (req, res) => {
    try {
        const { description } = req.body;
        const userId = req.userId;
        console.log("userId", userId)

        if (!description || !userId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        let tweet = await Tweet.create({
            description,
            userId: userId
        });

        return res.status(201).json({
            success: true,
            message: "Tweet Created Successfully.",
        });
    } catch (error) {
        console.log("Error while creating Tweet");
        console.log("Error", error);
        return res.status(400).json({
            success: false,
            message: "Failed to create Tweet.",
        });
    }
}

const deleteTweet = async (req, res) => {
    try {
        const { tweetId } = req.params;
        const userId = req.userId;

        if (!tweetId || !userId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        let tweet = await Tweet.findByIdAndDelete(tweetId);

        return res.status(200).json({
            success: true,
            message: "Tweet Deleted Successfully.",
        });
    } catch (error) {
        console.log("Error while Deleting Tweet");
        console.log("Error", error);
        return res.status(400).json({
            success: false,
            message: "Failed to Delete Tweet.",
        });
    }
}

const likeOrDislike = async (req, res) => {
    try {
        const userId = req.userId;
        const tweetId = req.params.id;

        const tweet = await Tweet.findById(tweetId);

        if (tweet?.like?.includes(userId)) {
            await Tweet.findByIdAndUpdate(tweetId, {
                $pull: {
                    like: userId
                }
            });
            return res.status(200).json({
                success: true,
                message: "Tweet Disliked Successfully.",
            });
        } else {
            await Tweet.findByIdAndUpdate(tweetId, {
                $push: {
                    like: userId
                }
            });
            return res.status(200).json({
                success: true,
                message: "Tweet Liked Successfully.",
            });
        }
    } catch (error) {
        console.log("Error while Liking or Disliking Tweet");
        console.log("Error", error);
        return res.status(400).json({
            success: false,
            message: "Failed to Like or Dislike Tweet.",
        });
    }
}

const getAllTweets = async (req, res) => {
    try {
        const userId = req.userId;
        const loggedInUser = await User.findById(userId);
        const loggedInUserTweets = await Tweet.find({ userId: userId });

        const followingUserTweets = await Promise.all(loggedInUser?.following.map(otherUserId => {
            return Tweet.find({ userId: otherUserId });
        }));

        return res.status(200).json({
            success: true,
            tweets: loggedInUserTweets.concat(...followingUserTweets),
        });
    } catch (error) {
        console.log("Error while fetching Tweets.");
        console.log("Error", error);
        return res.status(400).json({
            success: false,
            message: "Failed to Get All Tweets.",
        });
    }
}

const getFollowingTweets = async (req, res) => {
    try {
        const userId = req.userId;
        const loggedInUser = await User.findById(userId);

        const followingUserTweets = await Promise.all(loggedInUser?.following.map(otherUserId => {
            return Tweet.find({ userId: otherUserId });
        }));

        return res.status(200).json({
            success: true,
            tweets: followingUserTweets,
        });
    } catch (error) {
        console.log("Error while fetching Tweets.");
        console.log("Error", error);
        return res.status(400).json({
            success: false,
            message: "Failed to Get All Tweets.",
        });
    }
}

module.exports = {
    createTweet,
    deleteTweet,
    likeOrDislike,
    getAllTweets,
    getFollowingTweets
}