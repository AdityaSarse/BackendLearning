const mongoose = require("mongoose")

const albumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageFile: {
        type: String,
        default: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300"
    },
    musics: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "music"
        }
    ],
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
})

const albumModel = mongoose.model("album", albumSchema)

module.exports = albumModel 