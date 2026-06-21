const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    album: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    audioFile: {
        type: String,
        required: true
    },
    imageFile: {
        type: String,
        required: true
    }
})

const musicModel = mongoose.model("music", musicSchema);
module.exports = musicModel