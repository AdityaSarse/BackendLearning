const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    name: String,
    password: String
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel;