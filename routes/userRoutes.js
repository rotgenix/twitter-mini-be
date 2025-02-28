const express = require("express");
const { register, login, logOut, bookmark, myProfile, getOtherUsers, toggleFollow } = require("../controllers/userController");
const { isAuthenticated } = require("../config/auth");

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/recommended-users', isAuthenticated, getOtherUsers);
router.patch('/bookmark/:id', isAuthenticated, bookmark);
router.patch('/toggle-follow/:followingToUserId', isAuthenticated, toggleFollow);
router.get('/profile', isAuthenticated, myProfile);
router.get('/logout', logOut);

module.exports = router;