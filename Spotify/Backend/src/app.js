const express = require("express");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth.routes");
const musicRouter = require("./routes/music.routes");
const playlistRouter = require("./routes/playlist.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/music", musicRouter);
app.use("/api/playlist", playlistRouter);

module.exports = app;