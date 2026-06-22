const express = require("express")
console.log(">>> REGISTERING MUSIC ROUTES <<<");
const musicController = require("../controllers/music.controller")
const { upload } = require("../middlewares/multer")
const { authArtist, authUser } = require("../middlewares/auth.middelware")
const router = express.Router()

router.post("/upload", authArtist, upload.fields([
    {
        name: "audioFile",
        maxCount: 1
    },
    {
        name: "imageFile",
        maxCount: 1
    }
]), musicController.uploadMusic)
router.post("/create-album", authArtist, musicController.createAlbum)
router.get("/get-music", authUser, musicController.getMusic)
router.get("/get-albums", authUser, musicController.getAllAlbums)
router.get("/get-album/:id", authUser, musicController.getAlbumById)
module.exports = router
