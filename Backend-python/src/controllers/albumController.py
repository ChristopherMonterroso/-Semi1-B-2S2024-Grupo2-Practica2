from flask import request, jsonify
from models.albums import Album
from config.db import get_db

def createAlbum():
    db = next(get_db())
    try:
        # Extraer los datos del cuerpo de la solicitud
        data = request.get_json()
        album_name = data.get('album_name')
        id_user = data.get('id_user')

        # Validar que los campos necesarios están presentes
        if not album_name or not id_user:
            return jsonify({"message": "Please fill all fields", "status": False}), 400

        # Crear el nuevo álbum
        new_album = Album(album_name=album_name, id_user=id_user)
        db.add(new_album)
        db.commit()

        # Retornar la respuesta exitosa
        return jsonify({"message": "Album created successfully", "album": new_album.to_dict(), "status": True}), 201

    except Exception as error:
        db.rollback()  # Revertir la transacción en caso de error
        print(f"Error in createAlbum: {error}")
        return jsonify({"message": "Server error", "error": str(error), "status": False}), 500

def getAlbumByUserId(id_user):
    db = next(get_db())
    try:
        # Validar si el ID del usuario fue proporcionado
        if not id_user:
            return jsonify({"message": "User ID is required", "status": False}), 400

        # Buscar todos los álbumes del usuario especificado
        albums = db.query(Album).filter_by(id_user=id_user).all()

        # Verificar si se encontraron álbumes
        if not albums:
            return jsonify({"message": "Albums not found", "status": False}), 404

        # Convertir los álbumes a diccionarios antes de devolverlos
        albums_list = [album.to_dict() for album in albums]

        return jsonify({"albums": albums_list, "status": True}), 200

    except Exception as error:
        print(f"Error in get albums by user id: {error}")
        return jsonify({"message": "Server error", "error": str(error), "status": False}), 500

def updateAlbum(id_album):
    db = next(get_db())
    try:
        # Obtener los datos de la solicitud
        data = request.json
        album_name = data.get('album_name')

        # Validar si se proporcionó el ID del álbum
        if not id_album:
            return jsonify({"message": "Album ID is required", "status": False}), 400

        # Buscar el álbum por ID
        album = db.query(Album).filter_by(id_album=id_album).first()

        # Verificar si el álbum existe
        if not album:
            return jsonify({"message": "Album not found", "status": False}), 404

        # Comprobar si el nombre del álbum es "Fotos de perfil"
        if album.album_name == "Fotos de perfil":
            return jsonify({"message": "Album name cannot be changed", "status": False}), 400

        # Verificar si ya existe un álbum con el nuevo nombre
        album_exists = db.query(Album).filter_by(album_name=album_name).first()
        if album_exists:
            return jsonify({"message": "Album already exists", "status": False}), 400

        # Actualizar el nombre del álbum
        album.album_name = album_name
        db.commit()

        return jsonify({"message": "Album updated successfully", "status": True}), 200

    except Exception as error:
        print(f"Error in updateAlbum: {error}")
        return jsonify({"message": "Server error", "error": str(error), "status": False}), 500

def deleteAlbum(id_album):
    db = next(get_db())
    try:
        # Validar si se proporcionó el ID del álbum
        if not id_album:
            return jsonify({"message": "Album ID is required", "status": False}), 400

        # Buscar el álbum por su ID
        album = db.query(Album).filter_by(id_album=id_album).first()

        # Verificar si el álbum existe
        if not album:
            return jsonify({"message": "Album not found", "status": False}), 404

        # Verificar si el nombre del álbum es "Fotos de perfil"
        if album.album_name == "Fotos de perfil":
            return jsonify({"message": "Album name cannot be deleted", "status": False}), 400

        # Eliminar el álbum
        db.delete(album)
        db.commit()

        return jsonify({"message": "Album deleted successfully", "status": True}), 200

    except Exception as error:
        print(f"Error in deleteAlbum: {error}")
        return jsonify({"message": "Server error", "error": str(error), "status": False}), 500
