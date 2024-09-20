import os
import boto3
from flask import request, jsonify

# Configurar clientes de AWS Rekognition, Comprehend y Translate
rekognition = boto3.client('rekognition',
                           aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID_REKOGNITION'),
                           aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY_REKOGNITION'),
                           region_name=os.getenv('AWS_REGION_REKOGNITION'))

comprehend = boto3.client('comprehend',
                           aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID_REKOGNITION'),
                           aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY_REKOGNITION'),
                           region_name=os.getenv('AWS_REGION_REKOGNITION'))

translate = boto3.client('translate',
                           aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID_REKOGNITION'),
                           aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY_REKOGNITION'),
                           region_name=os.getenv('AWS_REGION_REKOGNITION'))

# Controlador para extraer texto de una imagen
def extractTextFromImage():
    try:
        # Verifica si se proporcionó una imagen
        if 'image' not in request.files:
            return jsonify({'message': 'No image file provided', 'status': False}), 400

        image_buffer = request.files['image'].read()

        # Parámetros para AWS Rekognition
        params = {
            'Image': {'Bytes': image_buffer}
        }

        # Detecta texto en la imagen
        response = rekognition.detect_text(Image=params['Image'])

        detected_text = [text['DetectedText'] for text in response['TextDetections']]
        return jsonify({'message': 'Text extracted successfully', 'text': detected_text, 'status': True}), 200

    except Exception as error:
        print("Error in extract_text_from_image:", error)
        return jsonify({'message': 'Server error', 'error': str(error), 'status': False}), 500


# Controlador para detectar el idioma y traducir el texto
def detectLanguageAndTranslate():
    try:
        text = request.json.get('text')

        if not text:
            return jsonify({'message': 'No text provided'}), 400

        # Detectar el idioma del texto
        detect_params = {'TextList': [text]}
        language_data = comprehend.batch_detect_dominant_language(TextList=detect_params['TextList'])
        detected_language = language_data['ResultList'][0]['Languages'][0]['LanguageCode']

        # Traducir el texto a varios idiomas
        target_languages = ['en', 'fr', 'de']
        translations = []

        for lang in target_languages:
            result = translate.translate_text(
                SourceLanguageCode=detected_language,
                TargetLanguageCode=lang,
                Text=text
            )
            translations.append({
                'language': lang,
                'translatedText': result['TranslatedText']
            })

        return jsonify({
            'message': 'Text translated successfully',
            'originalLanguage': detected_language,
            'translations': translations
        }), 200

    except Exception as error:
        print("Error in detect_language_and_translate:", error)
        return jsonify({'message': 'Server error', 'error': str(error)}), 500


# Controlador para obtener etiquetas de una imagen
def getLabelsFromImage():
    try:
        if 'image' not in request.files:
            return jsonify({'message': 'No image file provided', 'status': False}), 400

        image_buffer = request.files['image'].read()

        # Parámetros para AWS Rekognition
        params = {
            'Image': {'Bytes': image_buffer},
            'MaxLabels': 10,
            'MinConfidence': 75
        }

        # Detectar etiquetas
        response = rekognition.detect_labels(Image=params['Image'], MaxLabels=params['MaxLabels'], MinConfidence=params['MinConfidence'])

        labels = [{'name': label['Name'], 'confidence': label['Confidence']} for label in response['Labels']]
        return jsonify({'message': 'Labels extracted successfully', 'labels': labels, 'status': True}), 200

    except Exception as error:
        print("Error in get_labels_from_image:", error)
        return jsonify({'message': 'Server error', 'error': str(error), 'status': False}), 500
