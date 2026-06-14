const app = require('./src/app');
const connectDB = require('./src/DB/db');

connectDB();

app.listen(3000, () => {
    console.log("Server is running on 3000...");
});