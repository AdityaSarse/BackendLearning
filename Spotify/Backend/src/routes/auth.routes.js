const express = require("express");
const authController = require("../controllers/auth.controller");
const musicController = require("../controllers/music.controller");
const { authUser } = require("../middlewares/auth.middelware");

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.get("/get-music", authUser, musicController.getMusic);
module.exports = router;