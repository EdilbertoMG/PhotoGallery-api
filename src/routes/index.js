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
            return res.status(500).json({
                status: "Error",
                message: "There was an error"
            });
        }
        if (!photos) {
            return res.status(404).json({
                status: "Error",
                message: "There are no pictures"
            });
        }
        return res.status(200).json({
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
            return res.status(500).json({
                status: "Error",
                message: "There was an error"
            });
        }
        if (!photos) {
            return res.status(404).json({
                status: "Error",
                message: "There are no pictures"
            });
        }
            return res.status(200).json({
                status: "OK",
                photos
            }); 
    });
});

router.get('/api/photosInAlbums/:id', (req, res) => {
    const {
        id
    } = req.params;
    
    Photo.find({
        id_album: id
    }, (err, photos) => {
        if (err) {
            return res.status(500).json({
                status: "Error",
                message: "There was an error"
            });
        }
        if (!photos) {
            return res.status(404).json({
                status: "Error",
                message: "There are no pictures"
            });
        }
            return res.status(200).json({
                photos
            }); 
    });
});

router.get('/api/photos/search/:title', (req, res) => {
    const {
        title:title
    } = req.params;
    Photo.find({
        title:title
    }, (err, photos) => {
        if (err) {
            return res.status(500).json({
                status: "Error",
                message: "There was an error"
            });
        }
        if (!photos) {
            return res.status(404).json({
                status: "Error",
                message: "There are no pictures"
            });
        }
        return res.status(200).json({
            photos,
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
            return res.status(404).json({
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
                    return res.status(404).json({
                        status: "Error",
                        message: "Couldn't save photo"
                    });
                }
                if (photoStored) {
                    fs.unlink(req.file.path);

                    return res.status(200).json({
                        status: "OK",
                        message: "Saved photo"
                    });
                }
            });;
        }
    });
});

router.put('/api/photos',(req,res)=>{
    const {
        id,
        id_album
    } = req.body;
    
    var query =  {"$set":{"id_album":  id_album}}
    
    Photo.findOneAndUpdate({_id:id},query,(err,photosUpdated)=>{
        if(err || !photosUpdated){
            return res.status(404).json({
                status:"Error",
                message:"Couldn't update photo"
            });
        }
        return res.status(200).json({
            status:"OK",
            message:"Updated photo"
        });
    });
});

router.put('/api/photos/remove',(req,res)=>{
    const {
        id,
        id_album
    } = req.body;
    
    var query =  {"$unset":{"id_album": id_album}}
    
    Photo.findOneAndUpdate({_id:id},query,(err,photosUpdated)=>{
        if(err || !photosUpdated){
            return res.status(404).json({
                status:"Error",
                message:"Couldn't update photo"
            });
        }
        return res.status(200).json({
            status:"OK",
            message:"Updated photo"
        });
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
            return res.status(404).json({
                status: "Error",
                message: "Couldn't delete photo"
            });
        }
        if (photoDelete) {
            cloudinary.v2.uploader.destroy(photoDelete.public_id);
        }
        return res.status(200).json({
            status: "OK",
            message: "Photo deleted"
        });
    });
});

router.get('/api/albums', (req, res) => {
    Album.find({}).exec((err, album) => {
        if (err) {
            return res.status(500).json({
                status: "Error",
                message: "There was an error"
            });
        }

        if (!album) {
            return res.status(404).json({
                status: "Error",
                message: "There are no albums"
            });
        }

        return res.status(200).json({
            status: "OK",
            album
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
            return res.status(500).json({
                status: "Error",
                message: "There was an error"
            });
        }

        if (!albums) {
            return res.status(404).json({
                status: "Error",
                message: "There are no albums"
            });
        }

        return res.status(200).json({
            status: "OK",
            albums
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
            return res.status(404).json({
                status: "Error",
                message: "Couldn't save album"
            });
        }

        return res.status(200).json({
            status: "OK",
            message: "Saved album"
        });

    });
});

router.put('/api/albums',(req,res)=>{
    const {
        id,
        id_photo,
    } = req.body;
    
    var query =  {"$push":{"photos": {id_photo}}}
    
    Photo.findOneAndUpdate({_id:id},query,(err,palbumsUpdated)=>{
        if(err || !palbumsUpdated){
            return res.status(404).json({
                status:"Error",
                message:"Couldn't update album"
            });
        }
        return res.status(200).json({
            status:"OK",
            message:"Updated album"
        });
    });
});

router.delete('/api/albums/delete/:id', (req, res) => {
    const {
        id
    } = req.params;
    Album.findOneAndDelete({
        _id: id
    }, (err, albumDelete) => {
        if (err || !albumDelete) {
            return res.status(404).json({
                status: "Error",
                message: "Couldn't delete album"
            });
        }
        if (albumDelete) {
            Photo.find({"id_album": id}).stream()
            .on ("data", function (doc){
            var query =  {"$unset":{"id_album": id}}
                Photo.findOneAndUpdate({"id_album": id},query,(err,photoUp) =>{
                    if(err || !photoUp){
                        return res.status(404).json({
                            status:"Error",
                            message:"Couldn't update photo"
                        });
                    }
                });
        });
        }
        return res.status(200).json({
            status: "OK",
            message: "Album deleted"
        });
    });
});

router.get('/*', (req, res) => {
    res.redirect('/api/photos');
});

module.exports = router;