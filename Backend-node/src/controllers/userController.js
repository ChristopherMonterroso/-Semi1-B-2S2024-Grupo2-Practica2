const AWS = require("aws-sdk");
const multer = require("multer");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Album = require("../models/albums")
const Image = require("../models/images");
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const upload = multer({ storage: multer.memoryStorage() }).single(
  "profile_image"
);

exports.createUser = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err, status: false });
    }
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ message: "Please fill all fields", status: false });
      }

      const usernameExists = await User.findOne({ where: { username } });

      const emailExists = await User.findOne({ where: { email } });

      if (usernameExists) {
        return res
          .status(400)
          .json({ message: "Username already exists", status: false });
      }
      if (emailExists) {
        return res
          .status(400)
          .json({ message: "Email already exists", status: false });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: `Fotos_publicadas/${Date.now()}_${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const data = await s3.upload(uploadParams).promise();

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        profile_image_url: data.Location,
      });
      const newAlbum = await Album.create({
        album_name: "Fotos de perfil",
        id_user: user.id_user,
      });
      await Image.create({
        image_name: "Foto de perfil",
        description: "Foto de perfil",
        image_url: data.Location,
        id_album: newAlbum.id_album,
      });

      return res.status(201).json({ user, status: true });
    } catch (error) {
      return res.status(500).json({ message: error, status: false });
    }
  });
};

exports.getUserProfile = async (req, res) => {
  try {
    const { id_user } = req.params;
    if (!id_user) {
      return res
        .status(400)
        .json({ message: "User ID is required", status: false });
    }
    const user = await User.findByPk(id_user);
    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }
    return res.status(200).json({ user, status: true });
  } catch (error) {
    return res.status(500).json({ message: error, status: false });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id_user } = req.params;
    const { password } = req.body;
    if (!id_user) {
      return res
        .status(400)
        .json({ message: "User ID is required", status: false });
    }
    if (!password) {
      return res
        .status(400)
        .json({ message: "Password is required", status: false });
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
    await User.destroy({ where: { id_user: id_user } });
    return res.status(200).json({ message: "User deleted", status: true });
  } catch (error) {
    return res.status(500).json({ message: error, status: false });
  }
};

exports.updateUserProfile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err, status: false });
    }
    try {
      const { id_user } = req.params;
      const { username, email, password } = req.body;
      if (!id_user) {
        return res.status(400).json({ message: "User ID is required", status: false });
      }
      if (!password) {
        return res.status(400).json({ message: "Please fill all fields", status: false });
      }

      const user = await User.findByPk(id_user);
      if (!user) {
        return res.status(404).json({ message: "User not found", status: false });
      }
      if (username) {
        const usernameExists = await User.findOne({ where: { username } });
        if (usernameExists) {
          return res.status(400).json({ message: "Username already exists", status: false });
        }
      }
      if (email) {
        const emailExists = await User.findOne({ where: { email } });
        if (emailExists) {
          return res.status(400).json({ message: "Email already exists", status: false });
        }
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: "Invalid password", status: false });
      }

      const updateData = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;

      if (req.file) {
        const uploadParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: `Fotos_perfil/${Date.now()}_${req.file.originalname}`,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        };

        const data = await s3.upload(uploadParams).promise();
        updateData.profile_image_url = data.Location;
      } else {
        updateData.profile_image_url = user.profile_image_url;
      }

      await user.update(updateData);

      const getAlbum = await Album.findOne({ where: { id_user, album_name: "Fotos de perfil" } });
      await Image.create({
        image_name: "Foto de perfil",
        description: "Foto de perfil",
        image_url: updateData.profile_image_url,
        id_album: getAlbum.id_album
      });

      return res.status(200).json({ message: "User updated successfully", status: true });
    } catch (error) {
      return res.status(500).json({ message: error.message, status: false });
    }
  });
};

exports.authUser = async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password } = req.body;
    if (!password) {
      return res
        .status(400)
        .json({ message: "Password is required", status: false });
    }

    if (username) {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found", status: false });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res
          .status(400)
          .json({ message: "Invalid password", status: false });
      }
      return res.status(200).json({ user, status: true });
    }

    if (email) {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found", status: false });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res
          .status(400)
          .json({ message: "Invalid password", status: false });
      }
      return res.status(200).json({ user, status: true });
    }
    if (!username || !email) {
      return res
        .status(400)
        .json({ message: "Username or email is required", status: false });
    }
  } catch (error) {
    return res.status(500).json({ message: error, status: false });
  }
};

