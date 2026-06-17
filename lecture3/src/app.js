const express = require('express');
const multer = require('multer');
const uploadFile = require('../services/storage.service');
const app = express()
app.use(express.json());


const upload = multer({ stoage: multer.memoryStorage() })
app.post("/create-post", upload.single("image"), async(req, res) => {

    console.log(await req.body)
    console.log(req.file)

    const response = await uploadFile(req.file.buffer)

    console.log(response)
})


module.exports = app;