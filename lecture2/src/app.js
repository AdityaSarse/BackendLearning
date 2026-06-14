const express = require('express');
const noteModel = require('./models/noteModel')

const app = express();
app.use(express.json());

app.post("/notes", async(req, res) => {
    try {
        const data = req.body;
        console.log("Body received:", data); // 👈 check what's coming in
        await noteModel.create({
            title: data.title,
            description: data.description
        });
        res.status(201).json({
            message: "note created Successfully.."
        });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get("/notes", async(req, res) => {

    const notes = await noteModel.find()

    res.status(200).json({
        message: "note retrive from database ",
        notes: notes
    })
});

app.delete("/notes/:id", async(req, res) => {
    const id = req.params.id

    await noteModel.findOneAndDelete({
        _id: id
    })

    res.status(200).json({
        message: "Note deleted Successfully"
    })
});

app.patch("/notes/:id", async(req, res) => {
    const id = req.params.id
    const description = req.body.description
    const title = req.body.title
    await noteModel.findOneAndUpdate({
        _id: id
    }, {
        title: title,
        description: description
    })

    res.status(200).json({
        message: "Update Successfully"
    })
});
module.exports = app;