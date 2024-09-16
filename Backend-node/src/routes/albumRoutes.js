const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const imageController = require('../controllers/imageController');

router.post('/albums/create', albumController.createAlbum);
router.get('/users/:id_user/albums', albumController.getAlbumByUserId);
router.put('/albums/update/:id_album', albumController.updateAlbum);
router.delete('/albums/delete/:id_album', albumController.deleteAlbum);

router.post('/albums/image/create', imageController.createImage);
router.get('/albums/:id_album/images', imageController.getImageByAlbumId);
router.get('/albums/image/:id_image', imageController.getImageById);

module.exports = router;