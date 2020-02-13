const {
    Schema,
    model
} = require('mongoose');

const Album = new Schema({
    title: {
        type: String,
        required: [true, 'The name field is required']
    },
    description: {
        type: String
    },
    created_at: {
        type: Date,
        default: new Date()
    }
});

module.exports = model('Album', Album);