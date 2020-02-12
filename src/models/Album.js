const { Schema, model } = require('mongoose');

const Album = new Schema({
    title: String,
    description: String,
    id_album: String,
    created_at: String,
    photo_public_id: String,
    photo_imageURL: String
});

module.exports = model('Album', Album);