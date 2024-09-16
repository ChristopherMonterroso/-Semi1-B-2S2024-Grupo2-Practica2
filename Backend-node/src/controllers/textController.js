const AWS = require('aws-sdk');

// Configura AWS Rekognition
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_REKOGNITION,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_REKOGNITION,
    region: process.env.AWS_REGION_REKOGNITION
});

const rekognition = new AWS.Rekognition();
// Controlador para extraer texto
exports.extractTextFromImage = async (req, res) => {
    try {
        // Verifica si hay un archivo de imagen
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided', status: false });
        }

        const imageBuffer = req.file.buffer;

        // Configura los parámetros para AWS Rekognition
        const params = {
            Image: {
                Bytes: imageBuffer
            }
        };

        // Llama a Rekognition para detectar texto
        rekognition.detectText(params, (err, data) => {
            if (err) {
                console.error("Error extracting text from image:", err);
                return res.status(500).json({ message: 'Error extracting text from image', error: err, status: false });
            }

            // Mapea el texto detectado
            const detectedText = data.TextDetections.map(text => text.DetectedText);
            return res.status(200).json({ message: 'Text extracted successfully', text: detectedText ,status: true });
        });
    } catch (error) {
        console.error("Error in extractTextFromImage:", error);
        res.status(500).json({ message: 'Server error', error, status: false });
    }
};

const comprehend = new AWS.Comprehend();
const translate = new AWS.Translate();

exports.detectLanguageAndTranslate = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: 'No text provided' });
        }

        // Detectar el idioma del texto con Amazon Comprehend
        const detectParams = {
            TextList: [text] // Comprehend requiere una lista de textos
        };

        comprehend.batchDetectDominantLanguage(detectParams, (err, languageData) => {
            if (err) {
                console.error("Error detecting language:", err);
                return res.status(500).json({ message: 'Error detecting language', error: err });
            }

            const detectedLanguage = languageData.ResultList[0].Languages[0].LanguageCode;

            // Traducir el texto a varios idiomas (ejemplo: español, francés, alemán)
            const targetLanguages = ['en', 'fr', 'de'];
            const translations = targetLanguages.map(lang => {
                return translate.translateText({
                    SourceLanguageCode: detectedLanguage,
                    TargetLanguageCode: lang,
                    Text: text
                }).promise();
            });

            // Ejecutar las traducciones
            Promise.all(translations)
                .then(results => {
                    const translatedTexts = results.map((result, index) => ({
                        language: targetLanguages[index],
                        translatedText: result.TranslatedText
                    }));

                    return res.status(200).json({
                        message: 'Text translated successfully',
                        originalLanguage: detectedLanguage,
                        translations: translatedTexts
                    });
                })
                .catch(translationError => {
                    console.error("Error translating text:", translationError);
                    return res.status(500).json({ message: 'Error translating text', error: translationError });
                });
        });
    } catch (error) {
        console.error("Error in detectLanguageAndTranslate:", error);
        res.status(500).json({ message: 'Server error', error });
    }
};



// Función para obtener etiquetas de una imagen
exports.getLabelsFromImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided', status: false });
        }

        // Convierte la imagen a base64
        const imageBuffer = req.file.buffer;
        const imageBase64 = imageBuffer.toString('base64');

        // Parámetros para AWS Rekognition
        const params = {
            Image: {
                Bytes: Buffer.from(imageBase64, 'base64')
            },
            MaxLabels: 10, // Máximo de etiquetas
            MinConfidence: 75 // Confianza mínima
        };

        // Llama a Rekognition para detectar etiquetas
        rekognition.detectLabels(params, (err, data) => {
            if (err) {
                console.error("Error detecting labels:", err);
                return res.status(500).json({ message: 'Error detecting labels', error: err, status: false });
            }

            // Extrae las etiquetas detectadas
            const labels = data.Labels.map(label => ({
                name: label.Name,
                confidence: label.Confidence
            }));
            console.log('Labels extracted successfully');
            return res.status(200).json({ message: 'Labels extracted successfully', labels, status: true });
        });
    } catch (error) {
        console.error("Error in getLabelsFromImage:", error);
        res.status(500).json({ message: 'Server error', error, status: false });
    }
};