const { JsonWebTokenError } = require("jsonwebtoken");
const userModel = require("../models/user.model")
const JWT = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")


async function registerUser(req, res) {

    const { userName, email, password, role = "user" } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { userName },
            { email }
        ]
    })

    if (isUserAlreadyExists) {
        return res.status(409).json({
            message: "User is aready exists "
        })
    }

    const hash = await bcryptjs.hash(password, 10)

    const user = await userModel.create({
        userName,
        email,
        password: hash,
        role
    })

    const token = JWT.sign({
        id: user._id,
        role: role
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message: "user created Successfully",
        user: {
            id: user._id,
            userName: user.userName,
            email: user.email,
            role: user.role
        }
    })
}

module.exports = {
    registerUser
}