const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const User = require("../models/userSchema");

const register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashPassword = await bcryptjs.hash(password, 16);


        user = await User.create({
            name, email, password: hashPassword, username
        });

        return res.status(201).json({
            success: true,
            message: "User Created Successfully.",
        });
    } catch (error) {
        console.log("error while creating user");
        console.log("Error", error?.message);
        return res.status(400).json({
            success: false,
            message: "Failed to create User.",
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Doesn't Exists."
            });
        }

        const comparePassword = await bcryptjs.compare(password, user?.password);

        if (!comparePassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email/Password."
            });
        }

        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        return res.status(200).cookie("token", token, {
            expiresIn: "1d",
            // maxAge: 10 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        }).json({
            success: true,
            message: "User Logged in Successfully.",
            token
        });
    } catch (error) {
        console.log("error while creating user");
        console.log("Error", error);
        console.log("Error", error?.message);
        return res.status(400).json({
            success: false,
            message: "Failed to create User.",
        });
    }
}

const logOut = async (req, res) => {
    try {
        return res
            .status(200)
            .cookie("token", null, {
                expires: new Date(Date.now()),
                httpOnly: true,
                sameSite: "none",
                secure: true,
            }).json({
                success: true,
                message: "User Logged out Successfully.",
            });
    } catch (error) {
        console.log("Error while logging out user");
        console.log("Error", error);
        console.log("Error", error?.message);
        return res.status(400).json({
            success: false,
            message: "Failed to Logout User.",
        });
    }
}

const bookmark = async (req, res) => {
    try {
        const userId = req.userId;
        const tweetId = req.params.id;

        const user = await User.findById(userId);

        if (user?.bookmarks?.includes(tweetId)) {
            await User.findByIdAndUpdate(userId, {
                $pull: {
                    bookmarks: tweetId
                }
            });
            return res
                .status(200).json({
                    success: true,
                    message: "Tweet Removed from Bookmark.",
                });
        } else {
            {
                await User.findByIdAndUpdate(userId, {
                    $push: {
                        bookmarks: tweetId
                    }
                });
                return res
                    .status(200).json({
                        success: true,
                        message: "Tweet Added to Bookmark.",
                    });
            }
        }
    } catch (error) {
        console.log("Error while logging out user");
        console.log("Error", error);
        console.log("Error", error?.message);
        return res.status(400).json({
            success: false,
            message: "Failed to Logout User.",
        });
    }
}

const myProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).select("-password");

        return res
            .status(200)
            .json({
                success: true,
                message: "User Logged out Successfully.",
                user
            });
    } catch (error) {
        console.log("Error while logging out user");
        console.log("Error", error);
        console.log("Error", error?.message);
        return res.status(400).json({
            success: false,
            message: "Failed to Logout User.",
        });
    }
}

const getOtherUsers = async (req, res) => {
    try {
        const userId = req.userId;

        const users = await User.find({ _id: { $ne: userId } }).select("-password");

        return res
            .status(200)
            .json({
                success: true,
                message: "Recommended Users.",
                users: users || []
            });
    } catch (error) {
        console.log("Error while Getting Recommended users");
        console.log("Error", error);
        console.log("Error", error?.message);
        return res.status(400).json({
            success: false,
            message: "Failed to Get Recommended Users.",
        });
    }
}

const toggleFollow = async (req, res) => {
    try {
        const followedByUserId = req.userId;
        // console.log("followedByUserId", followedByUserId);

        const followingToUserId = req.params.followingToUserId;
        // console.log("followingToUserId", followingToUserId);

        const followedByUser = await User.findById(followedByUserId);
        // console.log("followedByUser", followedByUser);

        const followingToUser = await User.findById(followingToUserId);
        // console.log("followingToUser", followingToUser);

        // USER ALREADY IN FOLLOWER/FOLLOWING
        if (followedByUser?.following?.includes(followingToUserId) && followingToUser?.followers?.includes(followedByUserId)) {
            // Removing from following in followedByUser
            await followedByUser.updateOne({
                $pull: {
                    following: followingToUserId
                }
            });

            // Removing from followers in followingToUser
            await followingToUser.updateOne({
                $pull: {
                    followers: followedByUserId
                }
            });

            return res
                .status(200).json({
                    success: true,
                    message: "User Unfollowed Successfully.",
                });
        }
        else {
            // Adding to following in followedByUser
            await followedByUser.updateOne({
                $push: {
                    following: followingToUserId
                }
            });

            // Adding tp followers in followingToUser
            await followingToUser.updateOne({
                $push: {
                    followers: followedByUserId
                }
            });

            return res
                .status(200).json({
                    success: true,
                    message: "User Followed Successfully.",
                });
        }
    } catch (error) {
        console.log("Error while logging out user");
        console.log("Error", error);
        console.log("Error", error?.message);
        return res.status(400).json({
            success: false,
            message: "Failed to Logout User.",
        });
    }
}

module.exports = { register, login, logOut, bookmark, myProfile, getOtherUsers, toggleFollow };