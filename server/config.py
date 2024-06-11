from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from models import db
import secrets
import os

app = Flask(__name__, static_folder='../client/build')

secret_key = secrets.token_hex(16)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///inventory_management.db'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://your_username:your_password@localhost:5432/inventory_management'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#config for excel spreadsheet import
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
#config for excel spreadsheet import


app.config['SECRET_KEY'] = secret_key

migrate = Migrate(app,db)

db.init_app(app)

# CORS(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

