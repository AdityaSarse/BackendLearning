const mongoose = require('mongoose'); // was 'mongooose' (typo)

const noteSchema = new mongoose.Schema({
    title: String,
    description: String,
});

const noteModel = mongoose.model('note', noteSchema); // was mongoose.Model (capital M)

module.exports = noteModel; // was model.exports