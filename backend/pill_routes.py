from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from filenamelol import Pill, db
from ocr import process_image, query_chromadb
from werkzeug.utils import secure_filename
import os

pill = Blueprint('pill', __name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

sfda_brand_set = set()

def set_sfda_brands(brand_set):
    global sfda_brand_set
    sfda_brand_set = brand_set

@pill.route('/api/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "File has no name"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    text = process_image(filepath)
    meds = query_chromadb(text, sfda_brand_set)

    return jsonify({
        "ocr_text": text,              # ✅ key renamed to match frontend
        "medication_info": meds        # ✅ meds must have correct field names (see ocr.py)
    })



@pill.route('/api/pills', methods=['POST'])
@login_required
def add_pill():
    data = request.get_json()
    new_pill = Pill(
        user_id=current_user.id,
        name=data['name'],
        amount=data['amount'],
        duration=data['duration'],
        time=data['time'],
        repeat=data.get('repeat', 'No Repeat')
    )
    db.session.add(new_pill)
    db.session.commit()
    return jsonify({"success": True, "message": "Pill added"})

@pill.route('/api/schedule')
@login_required
def schedule():
    pills = Pill.query.filter_by(user_id=current_user.id).all()
    schedule = [
        {
            "name": pill.name,
            "amount": pill.amount,
            "duration": pill.duration,
            "time": pill.time,
            "repeat": pill.repeat
        }
        for pill in pills
    ]
    return jsonify(schedule)
