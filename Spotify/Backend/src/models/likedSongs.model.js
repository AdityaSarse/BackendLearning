const mongoose = require("mongoose");

const likedSongsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true
    },
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "music"
        }
    ]
}, { timestamps: true });

const likedSongsModel = mongoose.model("likedSongs", likedSongsSchema);
module.exports = likedSongsModel;
