import os
import boto3
from botocore.exceptions import ClientError
from flask import request, jsonify
from werkzeug.utils import secure_filename
from models.user import User
from models.albums import Album
from models.images import Image
from models.facialRecognition import FacialRecognition
from config.db import get_db
from flask_bcrypt import Bcrypt
import time

bcrypt = Bcrypt()

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

def getFacialRecognitionByUserId(id_user):
    db = next(get_db())
    try:
        # Verificar si se proporciona el id_user
        if not id_user:
            return jsonify({"message": "User ID is required", "status": False}), 400

        # Buscar el reconocimiento facial del usuario por id_user
        facial_recognition = db.query(FacialRecognition).filter_by(id_user=id_user).first()

        # Verificar si se encontró el registro
        if not facial_recognition:
            return jsonify({"message": "Facial recognition not found", "status": False}), 404

        # Devolver los datos del reconocimiento facial
        return jsonify({"facialRecognition": facial_recognition.to_dict(), "status": True}), 200

    except Exception as error:
        # Manejar errores del servidor
        print(f"Error in get facial recognition by user id: {error}")
        return jsonify({"message": "Server error", "error": str(error), "status": False}), 500

def updateFacialRecognition(id_user):
    db = next(get_db())
    try:
        # Verificar si hay un archivo adjunto en la solicitud
        if 'image' not in request.files:
            return jsonify({"message": "Please upload a image", "status": False}), 400

        file = request.files['image']
        if not file:
            return jsonify({"message": "Please upload a image", "status": False}), 400

        # Obtener datos del cuerpo de la solicitud
        password = request.form.get('password')
        status = request.form.get('status')

        if not id_user or not password or not status:
            return jsonify({"message": "Please fill all fields", "status": False}), 400

        # Intentar convertir el campo 'status' a booleano
        try:
            if status.lower() in ['true', '1', 'yes']:
                status = True
            elif status.lower() in ['false', '0', 'no']:
                status = False
            else:
                raise ValueError("Invalid value for 'status'")
        except ValueError as e:
            return jsonify({"message": str(e), "status": False}), 400

        # Buscar al usuario por id_user
        user = db.query(User).filter_by(id_user=id_user).first()
        if not user:
            return jsonify({"message": "User not found", "status": False}), 404

        # Verificar la contraseña
        match = bcrypt.check_password_hash(user.password, password)
        if not match:
            return jsonify({"message": "Invalid password", "status": False}), 400

        # Configurar los parámetros para subir el archivo a S3
        filename = secure_filename(file.filename)
        upload_key = f"Fotos_reconocimiento_facial/{int(time.time())}_{filename}"
        upload_params = {
            'Bucket': os.getenv('BUCKET_NAME'),
            'Key': upload_key,
            'Body': file,
            'ContentType': file.content_type,
        }

        # Subir archivo a S3
        data = s3.upload_fileobj(file, os.getenv('BUCKET_NAME'), upload_key)

        # Buscar el registro de reconocimiento facial
        facial_recognition = db.query(FacialRecognition).filter_by(id_user=id_user).first()

        if not facial_recognition:
            # Crear un nuevo registro si no existe
            new_facial_recognition = FacialRecognition(
                facial_image_url=f"https://{os.getenv('BUCKET_NAME')}.s3.amazonaws.com/{upload_key}",
                status=status,
                id_user=id_user
            )
            db.add(new_facial_recognition)
            db.commit()
            return jsonify({"message": "Facial recognition created successfully", "status": True}), 201

        # Actualizar el reconocimiento facial si ya existe
        facial_recognition.facial_image_url = f"https://{os.getenv('BUCKET_NAME')}.s3.amazonaws.com/{upload_key}"
        facial_recognition.status = status
        db.commit()

        return jsonify({"message": "Facial recognition updated successfully", "status": True}), 200

    except Exception as error:
        print(f"Error in updateFacialRecognition: {error}")
        return jsonify({"message": "Server error", "error": str(error), "status": False}), 500

def authFacialRecognition():
    db = next(get_db())
    try:
        # Verificar si hay un archivo adjunto en la solicitud
        if 'image' not in request.files:
            return jsonify({"message": "Please upload an image", "status": False}), 400

        file = request.files['image']
        if not file:
            return jsonify({"message": "Please upload an image", "status": False}), 400

        # Obtener datos del cuerpo de la solicitud
        username = request.form.get('username')
        email = request.form.get('email')

        user = None

        # Buscar usuario por username o email
        if username:
            user = db.query(User).filter_by(username=username).first()
            if not user:
                return jsonify({"message": "User not found", "status": False}), 404
        elif email:
            user = db.query(User).filter_by(email=email).first()
            if not user:
                return jsonify({"message": "User not found", "status": False}), 404
        else:
            return jsonify({"message": "Username or email is required", "status": False}), 400

        # Buscar la configuración de reconocimiento facial del usuario
        facial_recognition = db.query(FacialRecognition).filter_by(id_user=user.id_user).first()
        if not facial_recognition:
            return jsonify({"message": "Facial recognition not found", "status": False}), 404

        if not facial_recognition.status:
            return jsonify({"message": "Facial recognition is not activated", "status": False}), 400

        # Procesar la imagen enviada por el usuario
        user_image_buffer = file.read()  # Leer la imagen enviada
        image_key = '/'.join(facial_recognition.facial_image_url.split('/')[3:])

        # Crear el payload para AWS Rekognition
        params = {
            'SourceImage': {
                'Bytes': user_image_buffer  # Enviar la imagen como bytes
            },
            'TargetImage': {
                'S3Object': {
                    'Bucket': os.getenv('BUCKET_NAME'),  # Nombre del bucket donde está la imagen registrada
                    'Name': image_key  # Key de la imagen registrada
                }
            },
            'SimilarityThreshold': 80  # Umbral de similitud, ajustable
        }
        # Comparar las imágenes usando AWS Rekognition
        try:
            response = rekognition.compare_faces(**params)
        except ClientError as e:
            return jsonify({"message": "Error comparing faces", "error": str(e), "status": False}), 500

        # Verificar la similitud
        if response['FaceMatches'] and response['FaceMatches'][0]['Similarity'] >= 90:
            return jsonify({"message": "Login successful", "status": True, "user": user.to_dict()}), 200
        else:
            return jsonify({"message": "Face does not match. Login failed.", "status": False}), 401

    except Exception as error:
        return jsonify({"message": "Server error", "error": str(error), "status": False}), 500
