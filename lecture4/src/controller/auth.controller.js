const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken")

async function registerUser(req, res) {
    const { userName, email, password } = req.body;

    const userAlredy = await userModel.findOne({
        email
    })

    if (userAlredy) {
        res.status(409).json({
            message: "User is Alredy exits"
        })

    }

    const user = await userModel.create({
        userName,
        email,
        password
    })

    const token = jwt.sign({
            id: user._id
        },
        process.env.JWT_SECRET
    )

    res.cookie("token", token)

    res.status(201).json({
        message: "User register Successfully",
        user,
    })
}


module.exports = {
    registerUser
};