from flask import Blueprint, request, jsonify
from flask_login import login_user
from filenamelol import User, db
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('auth', __name__)


@auth.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "Email already registered"}), 409

    new_user = User(email=email, password=generate_password_hash(password))
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"success": True, "message": "User created"}), 201
@auth.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        login_user(user)
        return jsonify({"success": True, "message": "Login successful", "user_id": user.id})
    return jsonify({"success": False, "message": "Invalid credentials"}), 401
