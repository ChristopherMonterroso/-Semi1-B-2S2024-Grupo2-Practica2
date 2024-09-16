const Image = require("../models/images");
const AWS = require("aws-sdk");
const multer = require("multer");
const bcrypt = require("bcrypt");
const Album = require("../models/albums");

AWS.config.update({
    accessKeyId:process.env.AWS_ACCESS_KEY_ID ,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
  
  const s3 = new AWS.S3();
  
  const upload = multer({ storage: multer.memoryStorage() }).single(
    "image"
  );
  



// Crear una nueva imagen
exports.createImage = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: err, status: false });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file', status: false });
        }
        try {
            console.log(req.body);
            const { image_name, description,  id_album } = req.body;
    
            if (!image_name || !description ||  !id_album) {
                return res.status(400).json({ message: 'Please fill all fields', status: false });
            }
    
            
            
            const albumExists = await Album.findByPk(id_album);
            if (!albumExists) {
                return res.status(404).json({ message: 'Album not found', status: false });
            }

            const uploadParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: `Fotos_publicadas/${Date.now()}_${req.file.originalname}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
              };
            
            const data = await s3.upload(uploadParams).promise();

            const image = await Image.create({
                image_name,
                description,
                image_url: data.Location,
                id_album
            });
    
            return res.status(201).json({ message: 'Image created successfully', image, status: true });
        } catch (error) {
            console.error("Error in createImage:", error);
            res.status(500).json({ message: 'Server error', error, status: false });
        }
    });
};

exports.getImageByAlbumId = async (req, res) => {
    try {

        const { id_album } = req.params;
        if (!id_album) {
            return res.status(400).json({ message: 'Album ID is required', status: false });
        }

        const images = await Image.findAll({ where: { id_album } });

        if (!images) {
            return res.status(404).json({ message: 'Image not found', status: false });
        }

        return res.status(200).json({ images, status: true });
    } catch (error) {
        console.error("Error in get images by album id:", error);
        return res.status(500).json({ message: 'Server error', error, status: false });
    }
}

exports.getImageById = async (req, res) => {
    try {
        const { id_image } = req.params;
        if (!id_image) {
            return res.status(400).json({ message: 'Image ID is required', status: false });
        }

        const image = await Image.findByPk(id_image);
        if (!image) {
            return res.status(404).json({ message: 'Image not found', status: false });
        }

        // Asegúrate de que `image.image_url` contenga solo el "key" y no la URL completa
        const imageKey = image.image_url.replace(/^https?:\/\/[^\/]+\/(.+)$/, '$1');

        const params = {
            Image: {
                S3Object: {
                    Bucket: process.env.BUCKET_NAME,
                    Name: imageKey // Solo el key de la imagen, no la URL completa
                }
            },
            MaxLabels: 10, // Máximo de etiquetas
            MinConfidence: 75 // Confianza mínima
        };

        const rekognition = new AWS.Rekognition();
        rekognition.detectLabels(params, (err, data) => {
            if (err) {
                console.error("Error detecting labels:", err);
                return res.status(500).json({ message: 'Error detecting labels', error: err });
            }

            // Extrae las etiquetas detectadas
            const labels = data.Labels.map(label => ({
                name: label.Name,
                confidence: label.Confidence
            }));

            return res.status(200).json({ message: 'Labels extracted successfully', image, labels, status: true });
        });

    } catch (error) {
        console.error("Error in get image by id:", error);
        return res.status(500).json({ message: 'Server error', error, status: false });
    }
};
