import os
import boto3
from flask import request, jsonify
from werkzeug.utils import secure_filename
from models.albums import Album
from models.images import Image
from config.db import get_db
import time

s3 = boto3.client('s3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)

rekognition = boto3.client('rekognition',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)

def upload_to_s3(file, bucket_name, folder_name):
    try:
        filename = secure_filename(file.filename)
        key = f'{folder_name}/{int(time.time())}_{filename}'

        s3.upload_fileobj(
            file,
            bucket_name,
            key,
            ExtraArgs={"ContentType": file.content_type}
        )

        file_url = f'https://{bucket_name}.s3.amazonaws.com/{key}'
        return file_url
    except Exception as e:
        print(f'Error uploading to S3: {str(e)}')
        return None

# Crear una nueva imagen
def createImage():
    db = next(get_db())
    try:
        file = request.files.get('image')
        image_name = request.form.get('image_name')
        description = request.form.get('description')
        id_album = request.form.get('id_album')

        if not file:
            return jsonify({"message": "Please upload a file", "status": False}), 400

        if not image_name or not description or not id_album:
            return jsonify({"message": "Please fill all fields", "status": False}), 400

        # Verificar si el álbum existe
        album = db.query(Album).filter_by(id_album=id_album).first()
        if not album:
            return jsonify({"message": "Album not found", "status": False}), 404

        # Subir la imagen a S3
        image_url = upload_to_s3(file, os.getenv('BUCKET_NAME'), 'Fotos_publicadas')
        if not image_url:
            return jsonify({"message": "Error uploading file", "status": False}), 500

        # Crear la imagen en la base de datos
        new_image = Image(image_name=image_name, description=description, image_url=image_url, id_album=id_album)
        db.add(new_image)
        db.commit()

        return jsonify({"message": "Image created successfully", "image": new_image.to_dict(), "status": True}), 201

    except Exception as error:
        print(f"Error in createImage: {str(error)}")
        return jsonify({"message": "Server error", "error": str(error), "status": False}), 500

# Obtener imágenes por ID de álbum
def getImageByAlbumId(id_album):
    db = next(get_db())
    try:
        if not id_album:
            return jsonify({"message": "Album ID is required", "status": False}), 400

        images = db.query(Image).filter_by(id_album=id_album).all()
        if not images:
            return jsonify({"message": "Image not found", "status": False}), 404

        return jsonify({"images": [image.to_dict() for image in images], "status": True}), 200

    except Exception as error:
        print(f"Error in getImageByAlbumId: {str(error)}")
        return jsonify({"message": "Server error", "error": str(error), "status": False}), 500

# Obtener una imagen por su ID
def getImageById(id_image):
    db = next(get_db())
    try:
        if not id_image:
            return jsonify({"message": "Image ID is required", "status": False}), 400

        image = db.query(Image).filter_by(id_image=id_image).first()
        if not image:
            return jsonify({"message": "Image not found", "status": False}), 404

        # Verificar la URL de la imagen original
        image_url = image.image_url

        # Asegurarse de que la URL tenga un formato correcto para extraer el key
        bucket_name = os.getenv("BUCKET_NAME")
        base_url_pattern = f"https://{bucket_name}.s3"

        # Extraer solo el key de la imagen desde la URL
        if base_url_pattern in image_url:
            image_key = image_url.split(f"{base_url_pattern}.")[1].split('/', 1)[1]
        else:
            return jsonify({"message": "Invalid image URL format", "status": False}), 400
            
        params = {
            'Image': {
                'S3Object': {
                    'Bucket': bucket_name,
                    'Name': image_key
                }
            },
            'MaxLabels': 10,
            'MinConfidence': 75
        }

        response = rekognition.detect_labels(**params)
        labels = [{"name": label['Name'], "confidence": label['Confidence']} for label in response['Labels']]

        return jsonify({"message": "Labels extracted successfully", "image": image.to_dict(), "labels": labels, "status": True}), 200

    except Exception as error:
        print(f"Error in getImageById: {str(error)}")
        return jsonify({"message": "Server error", "error": str(error), "status": False}), 500
