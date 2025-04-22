from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from filenamelol import Pill, db
from ocr import process_image, extract_medication_info
from werkzeug.utils import secure_filename
import os

pill = Blueprint('pill', __name__)
UPLOAD_FOLDER = 'uploads'

@pill.route('/api/upload', methods=['POST'])
@login_required
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
    meds = extract_medication_info(text)

    return jsonify({"text": text, "medication_info": meds})

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
