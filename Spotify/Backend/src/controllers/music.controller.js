const { JsonWebTokenError } = require("jsonwebtoken")
const musicModel = require("../models/music.model")
const JWT = require("jsonwebtoken")
const bcryptjs = require("bcryptjs");
const storageService = require("../services/storage.service");
const albumModel = require("../models/album.model");


async function uploadMusic(req, res) {


    const token = req.cookies.token;
    if (!token) {
        return res.status(403).json({
            message: "Please login first"
        })
    }

    let decoded;
    try {
        decoded = JWT.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "artist") {
            return res.status(403).json({
                message: "You are not authorized to upload music"
            })
        }
    } catch (error) {
        return res.status(403).json({
            message: "Invalid token"
        })
    }

    const {
        title,
        album,
        genre,
        duration
    } = req.body;

    if (!title || !album || !genre || !duration) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
        return res.status(400).json({
            message: "Both audioFile and imageFile are required"
        })
    }

    try {
        const result = await storageService(req.files)

        const music = await musicModel.create({
            title,
            artist: decoded.id,
            album,
            genre,
            duration,
            audioFile: result.audioFile,
            imageFile: result.imageFile
        })

        return res.status(201).json({
            message: "Music uploaded successfully",
            music
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error during upload",
            error: error.message
        })
    }

}

async function createAlbum(req, res) {

    const token = req.cookies.token;
    if (!token) {
        return res.status(403).json({
            message: "Please login first"
        })
    }

    let decoded;
    try {
        decoded = JWT.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "artist") {
            return res.status(403).json({
                message: "You are not authorized to create album"
            })
        }
    } catch (error) {
        return res.status(403).json({
            message: "Invalid token"
        })
    }

    const { name } = req.body;
    if (!name) {
        return res.status(400).json({
            message: "Album name is required"
        })
    }

    let album;
    try {
        album = await albumModel.create({
            name: req.body.name,
            artist: decoded.id,
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error during album creation",
            error: error.message
        })
    }

    return res.status(201).json({
        message: "Album created successfully",
        album
    })
}
module.exports = {
    uploadMusic,
    createAlbum
}