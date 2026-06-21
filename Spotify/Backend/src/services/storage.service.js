const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function storageService(files) {

    const audio = files.audioFile[0];
    const image = files.imageFile[0];

    console.log("Uploading audio...");

    const audioUpload = await imagekit.upload({
        file: audio.buffer.toString("base64"),
        fileName: `audio-${Date.now()}-${audio.originalname}`,
        folder: "/music"
    });

    console.log("Audio uploaded");

    console.log("Uploading image...");

    const imageUpload = await imagekit.upload({
        file: image.buffer.toString("base64"),
        fileName: `image-${Date.now()}-${image.originalname}`,
        folder: "/music"
    });

    console.log("Image uploaded");

    return {
        audioFile: audioUpload.url,
        imageFile: imageUpload.url
    };
}

module.exports = storageService;