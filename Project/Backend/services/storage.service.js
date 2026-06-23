require("dotenv").config();
const ImageKit = require("@imagekit/nodejs/index.js");

const imagekit = new ImageKit({
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.URL_END_POINT,
});

async function uploadFile(buffer) {
    try {
        const result = await imagekit.files.upload({
            file: buffer.toString("base64"),
            fileName: `image-${Date.now()}.png`,
        });

        return result;
    } catch (error) {
        console.error("Upload Error:", error);
        throw error;
    }
}

module.exports = uploadFile;