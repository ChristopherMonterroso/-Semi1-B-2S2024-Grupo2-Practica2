from flask import Blueprint, request, jsonify
import controllers.albumController as albumController
import controllers.imageController as imageController

albumController_bp = Blueprint('albumController_bp', __name__, url_prefix = '/api')

@albumController_bp.route('/albums/create', methods=['POST'])
def createAlbum():
    return albumController.createAlbum()

@albumController_bp.route('/users/<int:id_user>/albums', methods=['GET'])
def getAlbumByUserId(id_user):
    return albumController.getAlbumByUserId(id_user)

@albumController_bp.route('/albums/update/<int:id_album>', methods=['PUT'])
def updateAlbum(id_album):
    return albumController.updateAlbum(id_album)

@albumController_bp.route('/albums/delete/<int:id_album>', methods=['DELETE'])
def deleteAlbum(id_album):
    return albumController.deleteAlbum(id_album)

@albumController_bp.route('/albums/image/create', methods=['POST'])
def createImage():
    return imageController.createImage()

@albumController_bp.route('/albums/<int:id_album>/images', methods=['GET'])
def getImageByAlbumId(id_album):
    return imageController.getImageByAlbumId(id_album)

@albumController_bp.route('/albums/image/<int:id_image>', methods=['GET'])
def getImageById(id_image):
    return imageController.getImageById(id_image)
    