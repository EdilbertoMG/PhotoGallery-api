const { Schema, model } = require('mongoose');

const Photo = new Schema({
    title: {
        type: String,
        required: [ true, 'The name field is required' ]
    },
    description: {
        type :String
    },
    imageURL: {
        type: String,
        required: [ true, 'The imageURL field is required' ]
    },
    public_id: {
        type: String,
        required: [ true, 'The public_id field is required' ]
    },
    id_album: {
        type: Schema.Types.ObjectId,
        ref: 'Album',
        required: [ false, 'The id_album is required' ]
    },
    created_at: {
        type: Date
    }
});

module.exports = model('Photo', Photo);