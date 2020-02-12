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

router.get('/photos', async (req, res) => {
    const photos = await Photo.find();
    res.json(photos);
});

router.get('/photos/:photo_id', async (req, res) => {
    const { photo_id } = req.params;
    const photo = await Photo.findById(photo_id);
    res.json(photo);
});

router.post('/photos', async (req, res) => {
    const { title, description} = req.body;
    // Saving Image in Cloudinary
    try {
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        const newPhoto = new Photo({title, description, imageURL: result.url, public_id: result.public_id, created_at: result.created_at});
        const resp = await  newPhoto.save();
        await fs.unlink(req.file.path);
    } catch (e) {
        console.log(e)
    }
    res.send({ message: "created!" });
});

router.get('/photos/delete/:photo_id', async (req, res) => {
    const { photo_id } = req.params;
    const photo = await Photo.findByIdAndRemove(photo_id);
    const result = await cloudinary.v2.uploader.destroy(photo.public_id);
    
    res.send({ message: "photo delete!" });
});

router.get('/albums', async (req, res) => {
    const album = await Album.find();
    res.json(album);
});

router.post('/album/add', async (req, res) => {
    const { title, description } = req.body;
    // Saving Image in Cloudinary
    try {
        const newAlbum = new Album({title, description, imageURL: result.url, public_id: result.public_id});
        await newAlbum.save();
    } catch (e) {
        console.log(e)
    }
    //res.redirect('/');
});
module.exports = router;