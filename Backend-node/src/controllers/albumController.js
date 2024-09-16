const Album = require("../models/albums");

// Crear un nuevo album
exports.createAlbum = async (req, res) => {
    try {
        const { album_name, id_user } = req.body;

        if (!album_name || !id_user) {
            return res.status(400).json({ message: 'Please fill all fields', status: false });
        }

        const albumExists = await Album.findOne({ where: { album_name } });

        if (albumExists) {
            return res.status(400).json({ message: 'Album already exists', status: false });
        }

        const album = await Album.create({
            album_name,
            id_user
        });

        return res.status(201).json({ message: 'Album created successfully', album, status: true });
    } catch (error) {
        console.error("Error in createAlbum:", error);
        res.status(500).json({ message: 'Server error', error, status: false });
    }
};


exports.getAlbumByUserId = async (req, res) => {
    try {

        const { id_user } = req.params;
        if (!id_user) {
            return res.status(400).json({ message: 'User ID is required', status: false });
        }

        const albums = await Album.findAll({ where: { id_user } });

        if (!albums) {
            return res.status(404).json({ message: 'Album not found', status: false });
        }

        return res.status(200).json({ albums, status: true });
    } catch (error) {
        console.error("Error in get albums by user id:", error);
        return res.status(500).json({ message: 'Server error', error, status: false });
    }
}

// Actualizar un album
exports.updateAlbum = async (req, res) => {
    try {
        const { id_album } = req.params;
        const { album_name } = req.body;

        if (!id_album) {
            return res.status(400).json({ message: 'Album ID is required', status: false });
        }

        const album = await Album.findByPk(id_album);
        
        if (!album) {
            return res.status(404).json({ message: 'Album not found', status: false });
        }
        const albumExists = await Album.findOne({ where: { album_name } });
        if (album.album_name === "Fotos de perfil"){
            return res.status(400).json({ message: 'Album name cannot be changed', status: false });
        }
        if (albumExists) {
            return res.status(400).json({ message: 'Album already exists', status: false });
        }
        
        await Album.update({ album_name }, { where: { id_album } });

        return res.status(200).json({ message: 'Album updated successfully', status: true });
    } catch (error) {
        console.error("Error in updateAlbum:", error);
        return res.status(500).json({ message: 'Server error', error, status: false });
    }
}

// Eliminar un album
exports.deleteAlbum = async (req, res) => {
    try {
        const { id_album } = req.params;

        if (!id_album) {
            return res.status(400).json({ message: 'Album ID is required', status: false });
        }

        const album = await Album.findByPk(id_album);

        if (!album) {
            return res.status(404).json({ message: 'Album not found', status: false });
        }
        if (album.album_name === "Fotos de perfil"){
            return res.status(400).json({ message: 'Album name cannot be deleted', status: false });
        }
        await Album.destroy({ where: { id_album } });

        return res.status(200).json({ message: 'Album deleted successfully', status: true });
    } catch (error) {
        console.error("Error in deleteAlbum:", error);
        return res.status(500).json({ message: 'Server error', error, status: false });
    }
}