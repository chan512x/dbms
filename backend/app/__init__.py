from flask import Flask
from .models import db
from flask_jwt_extended import JWTManager
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mariadb+mariadbconnector://root:system@127.0.0.1:3306/dummy'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'super-secret'
    CORS(app)
    db.init_app(app)
    jwt = JWTManager(app)

    # Import and register blueprints/routes
    from .routes import main_blueprint
    app.register_blueprint(main_blueprint)

    return app
