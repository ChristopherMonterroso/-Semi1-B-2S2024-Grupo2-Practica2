import os
import boto3
from flask import request, jsonify
from werkzeug.utils import secure_filename
from models.user import User
from models.albums import Album
from models.images import Image
from config.db import get_db
from flask_bcrypt import Bcrypt
import time

bcrypt = Bcrypt()

s3 = boto3.client('s3',
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

def createUser():
    db = next(get_db())
    try:
        file = request.files.get('profile_image')
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')

        if not username or not email or not password:
            return jsonify({"message": "Please fill all fields", "status": False}), 400

        username_exists = db.query(User).filter_by(username=username).first()
        email_exists = db.query(User).filter_by(email=email).first()

        if username_exists:
            return jsonify({"message": "Username already exists", "status": False}), 400
        if email_exists:
            return jsonify({"message": "Email already exists", "status": False}), 400

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        if file:
            profile_image_url = upload_to_s3(file, os.getenv('BUCKET_NAME'), 'Fotos_publicadas')
        else:
            profile_image_url = None

        new_user = User(username=username, email=email, password=hashed_password, profile_image_url=profile_image_url)
        db.add(new_user)
        db.commit()

        new_album = Album(album_name="Fotos de perfil", id_user=new_user.id_user)
        db.add(new_album)
        db.commit()

        new_image = Image(image_name="Foto de perfil", description="Foto de perfil", image_url=profile_image_url, id_album=new_album.id_album)
        db.add(new_image)
        db.commit()

        return jsonify({"user": new_user.to_dict(), "status": True}), 201

    except Exception as error:
        return jsonify({"message": "Error creating user", "error": str(error), "status": False}), 500

def getUserProfile(id_user):
    db = next(get_db())  
    try:
        if not id_user:
            return jsonify({"message": "User ID is required", "status": False}), 400
        user = db.query(User).filter_by(id_user=id_user).first()
        if not user:
            return jsonify({"message": "User not found", "status": False}), 404

        return jsonify({"user": user.to_dict(), "status": True}), 200

    except Exception as error:
        return jsonify({"message": "Error fetching user profile", "error": str(error), "status": False}), 500

def updateUserProfile(id_user):
    db = next(get_db())
    try:
        file = request.files.get('profile_image')
        data = request.form
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not id_user:
            return jsonify({"message": "User ID is required", "status": False}), 400

        user = db.query(User).filter_by(id_user=id_user).first()
        if not user:
            return jsonify({"message": "User not found", "status": False}), 404

        if username:
            username_exists = db.query(User).filter_by(username=username).first()
            if username_exists and username_exists.id_user != id_user:
                return jsonify({"message": "Username already exists", "status": False}), 400

        if email:
            email_exists = db.query(User).filter_by(email=email).first()
            if email_exists and email_exists.id_user != id_user:
                return jsonify({"message": "Email already exists", "status": False}), 400

        if password:
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            user.password = hashed_password

        if file:
            profile_image_url = upload_to_s3(file, os.getenv('BUCKET_NAME'), 'Fotos_publicadas')
            if profile_image_url:
                user.profile_image_url = profile_image_url

        if username:
            user.username = username
        if email:
            user.email = email

        db.commit()
        return jsonify({"user": user.to_dict(), "status": True}), 200

    except Exception as error:
        return jsonify({"message": "Error updating user profile", "error": str(error), "status": False}), 500

def deleteUser(id_user):
    db = next(get_db())
    try:
        password = request.json.get('password')

        if not id_user:
            return jsonify({"message": "User ID is required", "status": False}), 400

        if not password:
            return jsonify({"message": "Password is required", "status": False}), 400

        # Verificar si el usuario existe
        user = db.query(User).filter_by(id_user=id_user).first()
        if not user:
            return jsonify({"message": "User not found", "status": False}), 404

        # Verificar contraseña
        match = bcrypt.check_password_hash(user.password, password)
        if not match:
            return jsonify({"message": "Invalid password", "status": False}), 400

        # Eliminar imágenes asociadas a los álbumes del usuario
        albums = db.query(Album).filter_by(id_user=id_user).all()
        for album in albums:
            images = db.query(Image).filter_by(id_album=album.id_album).all()
            for image in images:
                db.delete(image)
            db.delete(album)

        # Eliminar al usuario
        db.delete(user)
        db.commit()

        return jsonify({"message": "User, albums, and images deleted", "status": True}), 200

    except Exception as error:
        db.rollback()  # Asegurarse de revertir la transacción si hay un error
        return jsonify({"message": str(error), "status": False}), 500


def authUser():
    db = next(get_db())
    try:
        username = request.json.get('username')
        email = request.json.get('email')
        password = request.json.get('password')

        if not password:
            return jsonify({"message": "Password is required", "status": False}), 400

        if username:
            user = db.query(User).filter_by(username=username).first()
            if not user:
                return jsonify({"message": "User not found", "status": False}), 404
            match = bcrypt.check_password_hash(user.password, password)
            if not match:
                return jsonify({"message": "Invalid password", "status": False}), 400
            return jsonify({"user": user.to_dict(), "status": True}), 200

        if email:
            user = db.query(User).filter_by(email=email).first()
            if not user:
                return jsonify({"message": "User not found", "status": False}), 404
            match = bcrypt.check_password_hash(user.password, password)
            if not match:
                return jsonify({"message": "Invalid password", "status": False}), 400
            return jsonify({"user": user.to_dict(), "status": True}), 200

        return jsonify({"message": "Username or email is required", "status": False}), 400

    except Exception as error:
        return jsonify({"message": "Error authenticating user", "error": str(error), "status": False}), 500