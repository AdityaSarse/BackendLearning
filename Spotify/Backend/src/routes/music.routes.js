const express = require("express")
const musicController = require("../controllers/music.controller")
const { upload } = require("../middlewares/multer")
const router = express.Router()

router.post("/upload", upload.fields([
    {
        name: "audioFile",
        maxCount: 1
    },
    {
        name: "imageFile",
        maxCount: 1
    }
]), musicController.uploadMusic)
module.exports = router
