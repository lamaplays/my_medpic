from flask import Flask
from flask_login import LoginManager
from flask_cors import CORS
from filenamelol import db, User
from auth_routes import auth
from pill_routes import pill, set_sfda_brands
from ocr import load_sfda

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pills.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Load and share SFDA brands
sfda_brand_set = load_sfda()
set_sfda_brands(sfda_brand_set)

db.init_app(app)
CORS(app)  # Enable frontend access
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.before_request
def create_tables():
    db.create_all()

# Register routes
app.register_blueprint(auth)
app.register_blueprint(pill)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
