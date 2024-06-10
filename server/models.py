from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from werkzeug.security import check_password_hash


db = SQLAlchemy()

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    email = db.Column(db.String)
    password_hash = db.Column(db.String)

    categories = db.relationship('Category', back_populates='user')

    # testlines = db.relationship('testline', back_populates='user')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    serialize_rules = ('-categories.user','-testlines.user',)

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
    name = db.Column(db.String)
    serial = db.Column(db.String)
    model = db.Column(db.String)
    description = db.Column(db.String)
    status = db.Column(db.String)
    productId = db.Column(db.String)
    location = db.Column(db.String)

    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))

    category = db.relationship('Category', back_populates='tools')

    serialize_rules = (
        '-category.tools', 
    )


# class TestLine(db.Model, SerializerMixin):
#     __tablename__ = 'testline'

#     id = db.Column(db.Integer, primary_key=True)
#     ticker = db.Column(db.String)
#     name = db.Column(db.String)
#     type = db.Column(db.String)
#     price = db.Column(db.Integer)
#     status = db.Column(db.String)

#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

#     user = db.relationship('user', back_populates='testlines')

#     serialize_rules = ('-user.testlines',)


