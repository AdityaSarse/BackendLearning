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


async function loginUser(req, res) {
    const {
        email,
        password
    } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    const user = await userModel.findOne({
        email
    })

    if (!user) {
        return res.status(401).json({
            message: "User not found"
        })
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid password"
        })
    }

    const token = JWT.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message: "Login successful",
        user: {
            id: user._id,
            userName: user.userName,
            email: user.email,
            role: user.role
        }
    })
}

async function logoutUser(req, res) {
    try {

    } catch (error) {

    }

    return res.status(200).json({
        message: "Logout successful"
    })
}
module.exports = {
    registerUser,
    loginUser,
    logoutUser
}