const express = require('express');
const userController = require('../controllers/userController');
const facialReController = require('../controllers/facialReController');
const router = express.Router();
const multer = require('multer');
router.post('/users/register', userController.createUser);
router.post('/auth/login', userController.authUser);
router.get('/users/profile/:id_user', userController.getUserProfile);
router.put('/users/profile/:id_user', userController.updateUserProfile);
router.delete('/users/delete/:id_user', userController.deleteUser);

router.get('/users/facial-recognition/data/:id_user', facialReController.getFacialRecognitionByUserId);
router.put('/users/facial-recognition/update/:id_user', facialReController.updateFacialRecognition);
router.post('/users/facial-recognition/auth', facialReController.authFacialRecognition);
module.exports = router;