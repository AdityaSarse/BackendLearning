const app = require("./src/app.js")
const connectDB = require("./src/DB/db.js")

connectDB();


app.listen(3000, () => {
    console.log("Server is rumming on 3000 ..!");

});