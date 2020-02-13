const {
    Router
} = require('express');
const router = Router();

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const Photo = require('../models/Photo');
const Album = require('../models/Album');
const fs = require('fs-extra');

router.get('/api/photos', (req, res) => {
    Photo.find({}).exec((err, photos) => {
        if (err) {
            res.status(500).json({
                status: "Error",
                message: "There was an error"
            });
        }

        if (!photos) {
            res.status(404).json({
                status: "Error",
                message: "There are no pictures"
            });
        }

        res.status(200).json({
            status: "OK",
            photos
        });
    });
});

router.get('/api/photos/:id', (req, res) => {
    const {
        id
    } = req.params;
    Photo.findById({
        _id: id
    }, (err, photos) => {
        if (err) {
            res.status(500).json({
                status: "Error",
                message: "There was an error"
            });
        }

        if (!photos) {
            res.status(404).json({
                status: "Error",
                message: "There are no pictures"
            });
        }

        res.status(200).json({
            status: "OK",
            photos
        });
    });
});

router.get('/api/photos/:title', (req, res) => {
    const {
        title
    } = req.params;
    Photo.find({
        title
    }).exec((err, photos) => {
        if (err) {
            res.status(500).json({
                status: "Error",
                message: "There was an error"
            });
        }

        if (!photos) {
            res.status(404).json({
                status: "Error",
                message: "There are no pictures"
            });
        }

        res.status(200).json({
            status: "OK",
            photos
        });
    });
});

/* router.get('/api/photos/:created_at', async (req, res) => {
    const { created_at } = req.params;
    const photos = await Photo.find({});
    res.json(photos);
}); */

router.post('/api/photos', (req, res) => {
    const {
        title,
        description
    } = req.body;
    // Saving Image in Cloudinary
    cloudinary.v2.uploader.upload(req.file.path, (err, result) => {
        if (err || !result) {
            res.status(404).json({
                status: "Error",
                message: "Couldn't save photo in cloudinary"
            });
        }

        if (result) {
            const newPhoto = new Photo({
                title,
                description,
                imageURL: result.url,
                public_id: result.public_id
            });
            newPhoto.save((err, photoStored) => {

                if (err || !photoStored) {
                    res.status(404).json({
                        status: "Error",
                        message: "Couldn't save photo"
                    });
                }

                if (photoStored) {
                    fs.unlink(req.file.path);
                }

                res.status(200).json({
                    status: "OK",
                    message: "Saved photo"
                });

            });;
        }
    });
});

router.delete('/api/photos/delete/:id', (req, res) => {
    const {
        id
    } = req.params;
    Photo.findOneAndDelete({
        _id: id
    }, (err, photoDelete) => {
        if (err || !photoDelete) {
            res.status(404).json({
                status: "Error",
                message: "Couldn't delete photo"
            });
        }
        if (photoDelete) {
            cloudinary.v2.uploader.destroy(photoDelete.public_id);
        }
        res.status(200).json({
            status: "OK",
            message: "Photo deleted"
        });
    });
});

router.get('/api/albums', (req, res) => {
    Album.find({}).exec((err, album) => {
        if (err) {
            res.status(500).json({
                status: "Error",
                message: "There was an error"
            });
        }

        if (!album) {
            res.status(404).json({
                status: "Error",
                message: "There are no albums"
            });
        }

        res.status(200).json({
            status: "OK",
            album
        });
    });
});

router.post('/api/albums', (req, res) => {
    const {
        title,
        description
    } = req.body;

    const newAlbum = new Album({
        title,
        description
    });

    newAlbum.save((err, albumsStored) => {

        if (err || !albumsStored) {
            res.status(404).json({
                status: "Error",
                message: "Couldn't save album"
            });
        }

        res.status(200).json({
            status: "OK",
            message: "Saved album"
        });

    });
});

router.get('/api/albums/:id', (req, res) => {
    const {
        id
    } = req.params;
    Album.findById({
        _id: id
    }, (err, albums) => {
        if (err) {
            res.status(500).json({
                status: "Error",
                message: "There was an error"
            });
        }

        if (!albums) {
            res.status(404).json({
                status: "Error",
                message: "There are no albums"
            });
        }

        res.status(200).json({
            status: "OK",
            albums
        });
    });
});

router.delete('/api/albums/delete/:id', (req, res) => {
    const {
        id
    } = req.params;
    Album.findOneAndDelete({
        _id: id
    }, (err, albumsDelete) => {
        if (err || !albumsDelete) {
            res.status(404).json({
                status: "Error",
                message: "Couldn't delete album"
            });
        }
        res.status(200).json({
            status: "OK",
            message: "Album deleted"
        });
    });
});

module.exports = router;