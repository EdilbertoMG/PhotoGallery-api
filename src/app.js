const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

// Initializations
const app = express();
require('./database');

// Settings
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// Middlewares cors
app.use(cors());

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    limits: {
        fileSize: 20000000
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    },
    fileFilter: (req, file, cb) => {
        filetypes = /jpeg|jpg|png|gif/
    }
});
app.use(multer({
    storage
}).single('image'));

// Routes
app.use(require('./routes'));

module.exports = app;