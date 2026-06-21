const { ImageKit, toFile } = require("@imagekit/nodejs");

const imagekit = new ImageKit({
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.URL_END_POINT
});

async function storageService(files) {
    const audio = files.audioFile[0];
    const image = files.imageFile[0];

    console.log("Uploading audio...");

    const audioUpload = await imagekit.files.upload({
        file: await toFile(audio.buffer, audio.originalname),
        fileName: `audio-${Date.now()}-${audio.originalname}`,
        folder: "/music"
    });

    console.log("Uploading image...");

    const imageUpload = await imagekit.files.upload({
        file: await toFile(image.buffer, image.originalname),
        fileName: `image-${Date.now()}-${image.originalname}`,
        folder: "/music"
    });

    return {
        audioFile: audioUpload.url,
        imageFile: imageUpload.url
    };
}

module.exports = storageService;