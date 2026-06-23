const express = require("express");
const playlistController = require("../controllers/playlist.controller");
const { authUser } = require("../middlewares/auth.middelware");
const router = express.Router();

router.post("/create", authUser, playlistController.createPlaylist);
router.get("/all", authUser, playlistController.getPlaylists);
router.post("/add-song", authUser, playlistController.addSongToPlaylist);
router.post("/remove-song", authUser, playlistController.removeSongFromPlaylist);
router.delete("/:id", authUser, playlistController.deletePlaylist);
router.post("/like/toggle", authUser, playlistController.toggleLikeSong);
router.get("/like/all", authUser, playlistController.getLikedSongs);

module.exports = router;
