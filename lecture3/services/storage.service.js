const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
    publicKey: "",
    privateKey: "",
    urlEndpoint: "",
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