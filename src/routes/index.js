const { Router } = require('express');
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

router.get('/api/photos',(req, res) => {
    Photo.find({}).exec((err,photos)=>{
        if(err){
            res.status(500).json({
                status:"Error",
                message:"There was an error"
            });
        }

        if(!photos){
            res.status(404).json({
                status:"Error",
                message:"There are no pictures"
            });
        }

        res.status(200).json({
            status:"OK",
            photos
        });
    });
});

router.get('/api/photos/:id', (req, res) => {
    const { id } = req.params;
    Photo.findById({_id:id},(err,photos)=>{
        if(err){
            res.status(500).json({
                status:"Error",
                message:"There was an error"
            });
        }

        if(!photos){
            res.status(404).json({
                status:"Error",
                message:"There are no pictures"
            });
        }

        res.status(200).json({
            status:"OK",
            photos
        });
    });
    
});

router.get('/api/photos/:title', (req, res) => {
    const { title } = req.params;
    Photo.find({title}).exec((err,photos)=>{
        if(err){
            res.status(500).json({
                status:"Error",
                message:"There was an error"
            });
        }

        if(!photos){
            res.status(404).json({
                status:"Error",
                message:"There are no pictures"
            });
        }

        res.status(200).json({
            status:"OK",
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
    const { title, description} = req.body;
    // Saving Image in Cloudinary
    
        cloudinary.v2.uploader.upload(req.file.path,(err,result) => {
            if(err || !result){
                res.status(404).json({
                    status:"Error",
                    message:"Couldn't save photo in cloudinary"
                });
            }

            if (result) {
                const newPhoto = new Photo({title, description, imageURL: result.url, public_id: result.public_id});
                newPhoto.save((err,photoStored)=>{

            if(err || !photoStored){
                res.status(404).json({
                    status:"Error",
                    message:"Couldn't save photo"
                });
            }
            
            if (photoStored) {
                fs.unlink(req.file.path);
            }

            res.status(200).json({
                status:"OK",
                message:"Saved photo"
            });
    
        });;
            }
        });
});

router.delete('/api/photos/delete/:id',(req, res) => {
    const {id} = req.params;
    Photo.findOneAndDelete({_id:id},(err,photoDelete)=>{
        if(err || !photoDelete){
            res.status(404).json({
                status:"Error",
                message:"Couldn't delete photo"
            });
        }
        if (photoDelete) {
            cloudinary.v2.uploader.destroy(photoDelete.public_id);
        }
        res.status(200).json({
            status:"OK",
            message:"Photo deleted"
        });
    });
});

router.get('/api/albums', async (req, res) => {
    const album = await Album.find();
    res.json(album);
});

router.post('/api/albums', async (req, res) => {
    const { title, description } = req.body;
    
    try {
        const newAlbum = new Album({title, description});
        await newAlbum.save();
    } catch (e) {
        console.log(e)
    }
    res.send({ message: "created!" });
});

router.get('/api/albums/:album_id', async (req, res) => {
    const { album_id } = req.params;
    const album = await Album.findById(album_id);
    res.json(album);
});

router.delete('/api/albums/delete/:album_id', async (req, res) => {
    const { album_id } = req.params;
    const photo = await Album.findByIdAndRemove(album_id);

    res.send({ message: "album remove" });
});

module.exports = router;