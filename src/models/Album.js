const {
    Schema,
    model
} = require('mongoose');

const mongoose = require('mongoose');

const Photo = mongoose.model('Photo');

const Album = new Schema({
    title: {
        type: String,
        required: [true, 'The name field is required']
    },
    description: {
        type: String
    },
    photos:[],
    created_at: {
        type: Date,
        default: new Date()
    }
});

module.exports = model('Album', Album);