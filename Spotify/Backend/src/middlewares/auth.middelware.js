const JWT = require("jsonwebtoken")

async function authArtist(req, res, next) {

    const token = req.cookies.token
    if (!token) {
        return res.status(403).json({
            message: "Please login first"
        })
    }
    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET)

        if (decoded.role !== "artist") {
            return res.status(403).json({
                message: "You are not authorized to perform this action"
            })
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(403).json({
                message: "Invalid token"
            })
        }
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

async function authUser(req, res, next) {
    const token = req.cookies.token
    if (!token) {
        return res.status(403).json({
            message: "Please login first"
        })
    }
    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(403).json({
                message: "Invalid token"
            })
        }
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports = {
    authArtist,
    authUser
};