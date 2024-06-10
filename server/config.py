from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from models import db
import secrets

app = Flask(__name__)

secret_key = secrets.token_hex(16)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///inventory_management.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = secret_key

migrate = Migrate(app,db)

db.init_app(app)

# CORS(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

