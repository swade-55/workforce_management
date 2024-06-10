from flask import jsonify, request, session
from models import db, User
from config import app
from werkzeug.security import generate_password_hash, check_password_hash


@app.route('/users', methods=['POST'])
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

    # return jsonify(new_user.to_dict()), 201
    return jsonify({"message": "Session valid", "user_id": new_user.id}), 201


@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        session['user_id'] = user.id
        return jsonify({"message": "Login successful", "user_id": user.id}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401


@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Logged out successfully"}), 200


# @app.route('/check_session', methods=['GET'])
# def check_session():
#     user_id = session.get('user_id')
#     if user_id:
#         return jsonify({"message": "Session valid", "user_id": user_id}), 200
#     else:
#         return jsonify({"message": "Session invalid"}), 401


@app.route('/check_session', methods=['GET'])
def check_session():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.get(user_id)
        if user:
            return jsonify({"message": "Session valid", "user_id": user.id}), 200
        else:
            # If no user is found for the user_id, it could mean the user has been deleted
            session.pop('user_id', None)  # Clear the session to handle this edge case
            return jsonify({"message": "Session invalid"}), 401
    else:
        return jsonify({"message": "Session invalid"}), 401