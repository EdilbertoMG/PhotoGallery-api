const { Schema, model } = require('mongoose');

const Photo = new Schema({
    title: String,
    description: String,
    imageURL: String,
    public_id: String,
    //id_album: String,
    created_at: Date
});

module.exports = model('Photo', Photo);