from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

from routes.userRoutes import userController_bp
from routes.albumRoutes import albumController_bp
from routes.textRoutes import textController_bp

server = Flask(__name__)
CORS(server)
load_dotenv()
PORT = int(os.getenv('PORT'))

server.register_blueprint(userController_bp)
server.register_blueprint(albumController_bp)
server.register_blueprint(textController_bp)

@server.route('/', methods=['GET'])
def home():
    return jsonify({'message':'Servidor Python'})

if __name__ == '__main__':
    server.run(host='0.0.0.0', debug=True, port=PORT)