from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from werkzeug.security import check_password_hash
from datetime import datetime
from werkzeug.security import check_password_hash, generate_password_hash


db = SQLAlchemy()

class UserRole:
    ADMIN = 'admin'
    MANAGER = 'manager'
    USER = 'user'

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    role = db.Column(db.String, default=UserRole.USER)
    can_manage_tools = db.Column(db.Boolean, default=False)
    can_manage_testlines = db.Column(db.Boolean, default=False)

    categories = db.relationship('Category', back_populates='user')
    reservations = db.relationship('Reservation', back_populates='user')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    serialize_rules = ('-categories.user', '-reservations.user',)

class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship('User', back_populates='categories')
    
    tools = db.relationship('Tool', back_populates='category')

    serialize_rules = (
        '-tools.category', 
        'user.categories',
    )
    

class Tool(db.Model, SerializerMixin):
    __tablename__ = 'tools'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    serialNumber = db.Column(db.String)
    productName = db.Column(db.String)
    productId = db.Column(db.String)
    description = db.Column(db.String)
    siteId = db.Column(db.String)
    storageLocation = db.Column(db.String)
    status = db.Column(db.String)
    itemOwner = db.Column(db.String)
    nokiaSto = db.Column(db.String)
    notes = db.Column(db.String)

    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))

    category = db.relationship('Category', back_populates='tools')

    serialize_rules = (
        '-category.tools', 
    )


class TestLine(db.Model, SerializerMixin):
    __tablename__ = 'testlines'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    status = db.Column(db.String, default='available')

    reservations = db.relationship('Reservation', back_populates='testline')

    serialize_rules = ('-reservations.testline',)

class Reservation(db.Model, SerializerMixin):
    __tablename__ = 'reservations'

    id = db.Column(db.Integer, primary_key=True)
    start_time = db.Column(db.DateTime, default=datetime.utcnow)
    end_time = db.Column(db.DateTime, nullable=True)
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    testline_id = db.Column(db.Integer, db.ForeignKey('testlines.id'))

    user = db.relationship('User', back_populates='reservations')
    testline = db.relationship('TestLine', back_populates='reservations')

    serialize_rules = ('-user.reservations', '-testline.reservations',)


