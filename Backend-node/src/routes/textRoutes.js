const express = require('express');
const router = express.Router();
const multer = require('multer');
const textController = require('../controllers/textController');

// Usa multer para manejar la carga de imágenes
const upload = multer({ storage: multer.memoryStorage() });

router.post('/extract-text', upload.single('image'), textController.extractTextFromImage);
router.post('/translate-text', textController.detectLanguageAndTranslate);
router.post('/get-labels', upload.single('image'), textController.getLabelsFromImage);


module.exports = router;
