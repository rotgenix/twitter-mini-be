const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")

dotenv.config({
    path: "../.env"
})

const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "User is not logged in",
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decode?.userId;
        next();
    } catch (error) {
        console.log("Error while Authenticating");
        console.log("Error", error);
    }
}

module.exports = {
    isAuthenticated
}