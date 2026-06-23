require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/DB/db");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
connectDB();
