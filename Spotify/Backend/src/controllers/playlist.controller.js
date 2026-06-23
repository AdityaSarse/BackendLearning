const playlistModel = require("../models/playlist.model");
const likedSongsModel = require("../models/likedSongs.model");

async function createPlaylist(req, res) {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Playlist name is required" });
    }
    try {
        const playlist = await playlistModel.create({
            name,
            user: req.user.id,
            songs: []
        });
        return res.status(201).json({ message: "Playlist created successfully", playlist });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error during playlist creation", error: error.message });
    }
}

async function getPlaylists(req, res) {
    try {
        const playlists = await playlistModel.find({ user: req.user.id })
            .populate({
                path: "songs",
                populate: {
                    path: "artist",
                    select: "userName email"
                }
            });
        return res.status(200).json({ message: "Playlists retrieved successfully", playlists });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error retrieving playlists", error: error.message });
    }
}

async function addSongToPlaylist(req, res) {
    const { playlistId, songId } = req.body;
    if (!playlistId || !songId) {
        return res.status(400).json({ message: "playlistId and songId are required" });
    }
    try {
        const playlist = await playlistModel.findOne({ _id: playlistId, user: req.user.id });
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }
        if (playlist.songs.includes(songId)) {
            return res.status(400).json({ message: "Song already exists in playlist" });
        }
        playlist.songs.push(songId);
        await playlist.save();
        
        // Return populated playlist to sync frontend state easily
        const populatedPlaylist = await playlistModel.findById(playlistId)
            .populate({
                path: "songs",
                populate: {
                    path: "artist",
                    select: "userName email"
                }
            });

        return res.status(200).json({ message: "Song added to playlist", playlist: populatedPlaylist });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error adding song to playlist", error: error.message });
    }
}

async function removeSongFromPlaylist(req, res) {
    const { playlistId, songId } = req.body;
    if (!playlistId || !songId) {
        return res.status(400).json({ message: "playlistId and songId are required" });
    }
    try {
        const playlist = await playlistModel.findOne({ _id: playlistId, user: req.user.id });
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }
        playlist.songs = playlist.songs.filter(id => id.toString() !== songId);
        await playlist.save();

        const populatedPlaylist = await playlistModel.findById(playlistId)
            .populate({
                path: "songs",
                populate: {
                    path: "artist",
                    select: "userName email"
                }
            });

        return res.status(200).json({ message: "Song removed from playlist", playlist: populatedPlaylist });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error removing song from playlist", error: error.message });
    }
}

async function deletePlaylist(req, res) {
    try {
        const playlist = await playlistModel.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found or unauthorized" });
        }
        return res.status(200).json({ message: "Playlist deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error deleting playlist", error: error.message });
    }
}

async function toggleLikeSong(req, res) {
    const { songId } = req.body;
    if (!songId) {
        return res.status(400).json({ message: "songId is required" });
    }
    try {
        let likedSongs = await likedSongsModel.findOne({ user: req.user.id });
        if (!likedSongs) {
            likedSongs = await likedSongsModel.create({
                user: req.user.id,
                songs: [songId]
            });
            return res.status(200).json({ message: "Song liked", likedSongs, liked: true });
        }

        const songIndex = likedSongs.songs.indexOf(songId);
        let liked = false;
        if (songIndex > -1) {
            likedSongs.songs.splice(songIndex, 1);
        } else {
            likedSongs.songs.push(songId);
            liked = true;
        }
        await likedSongs.save();
        return res.status(200).json({ message: liked ? "Song liked" : "Song unliked", likedSongs, liked });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error toggling song like", error: error.message });
    }
}

async function getLikedSongs(req, res) {
    try {
        let likedSongs = await likedSongsModel.findOne({ user: req.user.id })
            .populate({
                path: "songs",
                populate: {
                    path: "artist",
                    select: "userName email"
                }
            });
        if (!likedSongs) {
            likedSongs = await likedSongsModel.create({
                user: req.user.id,
                songs: []
            });
        }
        return res.status(200).json({ message: "Liked songs retrieved successfully", songs: likedSongs.songs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error retrieving liked songs", error: error.message });
    }
}

module.exports = {
    createPlaylist,
    getPlaylists,
    addSongToPlaylist,
    removeSongFromPlaylist,
    deletePlaylist,
    toggleLikeSong,
    getLikedSongs
};
