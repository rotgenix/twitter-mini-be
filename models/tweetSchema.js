const mongoose = require("mongoose")

const tweetSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    like: {
        type: Array,
        default: [],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true
});

const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;