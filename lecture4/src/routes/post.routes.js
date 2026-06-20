const express = require("express");
const jwt = require("jsonwebtoken")
const router = express();

router.post("/create", async(req, res) => {

    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({
            message: "unauthorized"
        })
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({
            message: "unauthorized"
        })
    }

    res.status(201).json({
        message: "post created successfully "
    })
})
module.exports = router;