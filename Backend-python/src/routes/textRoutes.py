from flask import Blueprint, request, jsonify
import controllers.textController as textController

textController_bp = Blueprint('textController_bp', __name__, url_prefix = '/api')

@textController_bp.route('/extract-text', methods=['POST'])
def extractTextFromImage():
    return textController.extractTextFromImage()

@textController_bp.route('/translate-text', methods=['POST'])
def detectLanguageAndTranslate():
    return textController.detectLanguageAndTranslate()

@textController_bp.route('/get-labels', methods=['POST'])
def getLabelsFromImage():
    return textController.getLabelsFromImage()