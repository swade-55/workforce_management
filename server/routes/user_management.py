from flask import jsonify, request, session
from models import db, User, UserRole
from config import app
from werkzeug.security import generate_password_hash, check_password_hash

# Helper function to check admin role
def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.role == UserRole.ADMIN

@app.route('/api/users', methods=['POST'])
def add_user():
    data = request.get_json()
    if not is_admin(data.get('admin_id')):
        return jsonify({'error': 'Unauthorized access'}), 403

    new_user = User(
        username=data['username'],
        email=data['email'],
        role=data.get('role', UserRole.USER),
        can_manage_tools=data.get('can_manage_tools', False),
        can_manage_testlines=data.get('can_manage_testlines', False),
    )
    new_user.set_password(data['password'])

    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.to_dict()), 200

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    data = request.get_json()
    if not is_admin(data.get('admin_id')):
        return jsonify({'error': 'Unauthorized access'}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({'message': 'User deleted successfully'}), 200

@app.route('/api/users/<int:user_id>', methods=['PATCH'])
def update_user(user_id):
    data = request.get_json()
    if not is_admin(data.get('admin_id')):
        return jsonify({'error': 'Unauthorized access'}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    if 'role' in data:
        user.role = data['role']
    if 'can_manage_tools' in data:
        user.can_manage_tools = data['can_manage_tools']
    if 'can_manage_testlines' in data:
        user.can_manage_testlines = data['can_manage_testlines']

    db.session.commit()

    return jsonify(user.to_dict()), 200

@app.route('/api/users', methods=['GET'])
def fetch_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

@app.route('/api/create_user', methods=['POST'])
def create_user():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'message': 'User already exists'}), 409

    hashed_password = generate_password_hash(password)

    new_user = User(username=username, email=email, password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully", "user_id": new_user.id}), 201

@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        session['user_id'] = user.id
        return jsonify({"message": "Login successful", "user": user.to_dict()}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/api/check_session', methods=['GET'])
def check_session():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.get(user_id)
        if user:
            return jsonify({"message": "Session valid", "user": user.to_dict(), "isAuthenticated": True}), 200
        else:
            session.pop('user_id', None)
            return jsonify({"message": "Session invalid"}), 401
    else:
        return jsonify({"message": "Session invalid"}), 401
