const FacialRecognition = require("../models/facialRecognition");
const User = require("../models/user");
const AWS = require("aws-sdk");
const multer = require("multer");
const bcrypt = require("bcrypt");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();
const upload = multer({ storage: multer.memoryStorage() }).single("image");

exports.getFacialRecognitionByUserId = async (req, res) => {
  try {
    const { id_user } = req.params;
    if (!id_user) {
      return res
        .status(400)
        .json({ message: "User ID is required", status: false });
    }

    const facialRecognition = await FacialRecognition.findOne({
      where: { id_user },
    });

    if (!facialRecognition) {
      return res
        .status(404)
        .json({ message: "Facial recognition not found", status: false });
    }

    return res.status(200).json({ facialRecognition, status: true });
  } catch (error) {
    console.error("Error in get facial recognition by user id:", error);
    return res
      .status(500)
      .json({ message: "Server error", error, status: false });
  }
};

exports.updateFacialRecognition = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err, status: false });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Please upload a file", status: false });
    }
    try {
      
      const { id_user } = req.params;
      const { password, status } = req.body;
      console.log(password, status);
      if (!id_user || !password || !status) {
        return res
          .status(400)
          .json({ message: "Please fill all fields", status: false });
      }
      const user = await User.findByPk(id_user);

      if (!user) {
        return res.status(404).json({ message: "User not found", status: false });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res
          .status(400)
          .json({ message: "Invalid password", status: false });
      }

      const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: `Fotos_reconocimiento_facial/${Date.now()}_${
          req.file.originalname
        }`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const data = await s3.upload(uploadParams).promise();

      const recognition = await FacialRecognition.findOne({
         where: { id_user },
       });
       if (!recognition) {
          await FacialRecognition.create({ facial_image_url: data.Location,status,id_user, });
           
           return res.status(201).json({message: "Facial recognition created successfully", status: true,});
       }

      const facialRecognition = await FacialRecognition.update(
        {
          facial_image_url: data.Location,
            status
        },
        {
          where: { id_user },
        }
      );

      return res.status(201).json({
        message: "Facial recognition updated successfully",
        status: true,
      });
    } catch (error) {
      console.error("Error in updateFacialRecognition:", error);
      res.status(500).json({ message: "Server error", error, status: false });
    }
  });
};



exports.authFacialRecognition = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err, status: false });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Please upload a file", status: false });
    }
  try {
    const { username, email } = req.body;

    let user;

    // Buscar usuario por username o email
    if (username) {
      user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(404).json({ message: "User not found", status: false });
      }
    } else if (email) {
      user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User not found", status: false });
      }
    } else {
      return res.status(400).json({ message: "Username or email is required", status: false });
    }

    // Buscar la configuración de reconocimiento facial del usuario
    const facialRecognition = await FacialRecognition.findOne({
      where: { id_user: user.id_user },
    });

    if (!facialRecognition) {
      return res.status(404).json({ message: "Facial recognition not found", status: false });
    }

    if (!facialRecognition.status) {
      return res.status(400).json({ message: "Facial recognition is not activated", status: false });
    }

    // Procesar la imagen enviada por el usuario (por ejemplo desde req.file con multer)
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided", status: false });
    }
    const userImageBuffer = req.file.buffer; // Imagen enviada por el usuario
    const imageKey = facialRecognition.facial_image_url.replace(/^https?:\/\/[^\/]+\/(.+)$/, '$1');
    // Parámetros para AWS Rekognition para comparar la imagen con la almacenada
    const params = {
      SourceImage: {
        Bytes: userImageBuffer
      },
      TargetImage: {
        S3Object: {
          Bucket: process.env.BUCKET_NAME, // Nombre del bucket donde está la imagen registrada
          Name: imageKey // Key de la imagen registrada
        }
      },
      SimilarityThreshold: 80 // Umbral de similitud, puedes ajustarlo según sea necesario
    };

    // Comparar las imágenes usando AWS Rekognition
    rekognition.compareFaces(params, (err, data) => {
      if (err) {
        console.error("Error comparing faces:", err);
        return res.status(500).json({ message: 'Error comparing faces', error: err });
      }

      // Verificar la similitud
      if (data.FaceMatches.length > 0 && data.FaceMatches[0].Similarity >= 90) {
        return res.status(200).json({ message: "Login successful", status: true, user });
      } else {
        return res.status(401).json({ message: "Face does not match. Login failed.", status: false });
      }
    });

  } catch (error) {
    console.error("Error in authFacialRecognition:", error);
    return res.status(500).json({ message: 'Server error', error, status: false });
  }
})
};