const express = require("express");
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");

const databaseConnection = require("./config/databse");

const userRoutes = require("./routes/userRoutes");
const tweetRoutes = require("./routes/tweetRoutes");

const app = express();

dotenv.config({
    path: ".env"
});

databaseConnection();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Server Health Route
app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Sab kuch ek dum mast chal raha hai!!!👌🏻"
    });
});

// API Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/tweet", tweetRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});