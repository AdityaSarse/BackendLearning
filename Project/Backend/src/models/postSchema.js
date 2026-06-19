const mongoose = require("mongoose");
const { Network } = require("node:inspector/promises");

const postSchema = new mongoose.Schema({
    image: String,
    caption: String
})


const postModel = mongoose.model("post", postSchema)

module.exports = postModel;