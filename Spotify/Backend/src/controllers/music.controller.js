const { JsonWebTokenError } = require("jsonwebtoken")
const musicModel = require("../models/music.model")
const JWT = require("jsonwebtoken")
const bcryptjs = require("bcryptjs");
const storageService = require("../services/storage.service");
const albumModel = require("../models/album.model");

async function uploadMusic(req, res) {
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
            artist: req.user.id,
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
            artist: req.user.id,
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

async function getMusic(req, res) {
    try {
        const music = await musicModel.find().populate("artist", "userName email");
        return res.status(200).json({
            message: "Music retrieved successfully",
            music
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error during fetching music",
            error: error.message
        });
    }
}

async function getAllAlbums(req, res) {
    try {
        const albums = await albumModel.find()
            .populate("artist", "userName email")
            .populate("musics");
        return res.status(200).json({
            message: "Albums retrieved successfully",
            albums
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error during fetching albums",
            error: error.message
        });
    }
}

async function getAlbumById(req, res) {
    try {
        const album = await albumModel.findById(req.params.id)
            .populate("artist", "userName email")
            .populate("musics");
        if (!album) {
            return res.status(404).json({
                message: "Album not found"
            });
        }
        return res.status(200).json({
            message: "Album retrieved successfully",
            album
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error during fetching album",
            error: error.message
        });
    }
}

module.exports = {
    uploadMusic,
    createAlbum,
    getMusic,
    getAllAlbums,
    getAlbumById
}