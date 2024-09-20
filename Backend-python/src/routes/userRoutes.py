from flask import Blueprint, request, jsonify
import controllers.userController as userController
import controllers.facialReController as facialReController

userController_bp = Blueprint('userController_bp', __name__, url_prefix = '/api')

@userController_bp.route('/users/register', methods=['POST'])
def createUser():
    return userController.createUser()

@userController_bp.route('/auth/login', methods=['POST'])
def authUser():
    return userController.authUser()

@userController_bp.route('/users/profile/<int:id_user>', methods=['GET'])
def getUserProfile(id_user):
    return userController.getUserProfile(id_user)

@userController_bp.route('/users/profile/<int:id_user>', methods=['PUT'])
def updateUserProfile(id_user):
    return userController.updateUserProfile(id_user)

@userController_bp.route('/users/delete/<int:id_user>', methods=['DELETE'])
def deleteUser(id_user):
    return userController.deleteUser(id_user)

@userController_bp.route('/users/facial-recognition/data/<int:id_user>', methods=['GET'])
def getFacialRecognitionByUserId(id_user):
    return facialReController.getFacialRecognitionByUserId(id_user)

@userController_bp.route('/users/facial-recognition/update/<int:id_user>', methods=['PUT'])
def updateFacialRecognition(id_user):
    return facialReController.updateFacialRecognition(id_user)

@userController_bp.route('/users/facial-recognition/auth', methods=['POST'])
def authFacialRecognition():
    return facialReController.authFacialRecognition()