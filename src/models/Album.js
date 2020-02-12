const { Schema, model } = require('mongoose');

const Album = new Schema({
    title: {
        type: String,
        required: [ true, 'The name field is required' ]
    },
    description: {
        type :String
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    photo_public_id: {
        type: Schema.Types.ObjectId,
        ref: 'Photo'
    },
    photo_imageURL: {
        type: String,
    }
});

module.exports = model('Album', Album);