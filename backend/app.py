from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from config import Config
from models import db, Student, Instructor, Admin

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
CORS(app)
jwt = JWTManager(app)

# Create database
with app.app_context():
    import os
    print("Database path:",os.path.abspath("database.db"))
    db.create_all()

# ---------------- AUTH ----------------
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    role = data['role']

    if role == "student":
        user = Student(name=data['name'], email=data['email'], password=data['password'])
    elif role == "instructor":
        user = Instructor(name=data['name'], email=data['email'], password=data['password'])
    elif role == "admin":
        user = Admin(name=data['name'], email=data['email'], password=data['password'])
    else:
        return jsonify({"msg": "Invalid role"}), 400

    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": f"{role.capitalize()} registered successfully"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    role = data['role']

    user = None
    if role == "student":
        user = Student.query.filter_by(email=data['email'], password=data['password']).first()
    elif role == "instructor":
        user = Instructor.query.filter_by(email=data['email'], password=data['password']).first()
    elif role == "admin":
        user = Admin.query.filter_by(email=data['email'], password=data['password']).first()

    if not user:
        return jsonify({"msg": "Invalid credentials"}), 401

    token = create_access_token(identity={"id": user.id, "role": role})
    return jsonify(access_token=token)


# ---------------- COURSES ----------------
@app.route('/courses', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    result = [
        {
            "id": c.id,
            "title": c.title,
            "instructor": c.instructor,
            "duration": c.duration,
            "seats": c.seats
        } for c in courses
    ]
    return jsonify(result)


@app.route('/courses', methods=['POST'])
@jwt_required()
def add_course():
    user = get_jwt_identity()
    if user['role'] != 'admin':
        return jsonify({"msg": "Admin only"}), 403

    data = request.json
    course = Course(**data)
    db.session.add(course)
    db.session.commit()
    return jsonify({"msg": "Course added"})


# ---------------- RESERVATION ----------------
@app.route('/reserve/<int:course_id>', methods=['POST'])
@jwt_required()
def reserve_course(course_id):
    user = get_jwt_identity()
    reservation = Reservation(user_id=user['id'], course_id=course_id)
    db.session.add(reservation)
    db.session.commit()
    return jsonify({"msg": "Course reserved"})


@app.route('/my-reservations', methods=['GET'])
@jwt_required()
def my_reservations():
    user = get_jwt_identity()
    reservations = Reservation.query.filter_by(user_id=user['id']).all()
    result = [{"course_id": r.course_id} for r in reservations]
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)