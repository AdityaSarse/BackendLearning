const express = require('express');
const multer = require('multer');
const uploadFile = require('../services/storage.service');
const postModel = require('./models/postSchema');
const app = express()
app.use(express.json());


const upload = multer({ stoage: multer.memoryStorage() })
app.post("/create-post", upload.single("image"), async(req, res) => {

    console.log(await req.body)
    console.log(req.file)

    const response = await uploadFile(req.file.buffer)

    const post = await postModel.create({
        image: response.url,
        caption: req.body.caption
    })

    return res.status(201).json({
        message: "post created Succesfully ..!",
        post
    })
})


app.get("/post", async(req, res) => {

    const post = await postModel.find()

    return res.status(200).json({
        message: "post is retirve Succesfully ..",
        post
    })
})

module.exports = app;