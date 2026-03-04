from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from models import db, User, Course, Reservation, Progress
from werkzeug.security import generate_password_hash, check_password_hash
import json

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
CORS(app)

# Create DB tables
with app.app_context():
    db.create_all()

# -----------------------
# Register User
# -----------------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json

    hashed_password = generate_password_hash(data["password"])

    user = User(
        name=data["name"],
        email=data["email"],
        password=hashed_password,
        role=data["role"]
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"})


# -----------------------
# Login (FIXED HASH CHECK)
# -----------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    user = User.query.filter_by(email=data["email"]).first()

    if user and check_password_hash(user.password, data["password"]):
        return jsonify({
            "id": user.id,
            "name": user.name,
            "role": user.role
        })

    return jsonify({"message": "Invalid credentials"}), 401


# -----------------------
# Create Course
# -----------------------
@app.route("/courses", methods=["POST"])
def create_course():
    data = request.json

    course = Course(
        title=data["title"],
        description=data["description"],
        fee=data["fee"],
        duration_weeks=data["duration_weeks"],
        schedule=data["schedule"],
        instructor_id=data["instructor_id"]
    )

    db.session.add(course)
    db.session.commit()

    return jsonify({"message": "Course created"})


# -----------------------
# Get All Courses
# -----------------------
@app.route("/courses", methods=["GET"])
def get_courses():
    courses = Course.query.all()

    result = []
    for c in courses:
        result.append({
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "fee": c.fee,
            "duration_weeks": c.duration_weeks
        })

    return jsonify(result)


# -----------------------
# Get Single Course
# -----------------------
@app.route("/course/<int:course_id>", methods=["GET"])
def get_course_details(course_id):
    course = Course.query.get(course_id)

    if not course:
        return jsonify({"message": "Course not found"}), 404

    return jsonify({
        "id": course.id,
        "title": course.title,
        "description": course.description,
        "fee": course.fee,
        "duration_weeks": course.duration_weeks,
        "schedule": course.schedule
    })


# -----------------------
# Enroll (Prevent Duplicate + Create Progress)
# -----------------------
@app.route("/reserve", methods=["POST"])
def reserve_course():
    data = request.json

    existing = Reservation.query.filter_by(
        student_id=data["student_id"],
        course_id=data["course_id"]
    ).first()

    if existing:
        return jsonify({"message": "Already enrolled"})

    reservation = Reservation(
        student_id=data["student_id"],
        course_id=data["course_id"]
    )

    db.session.add(reservation)
    db.session.commit()

    # Create Progress record
    progress = Progress(
        student_id=data["student_id"],
        course_id=data["course_id"],
        completed_weeks=0
    )

    db.session.add(progress)
    db.session.commit()

    return jsonify({"message": "Course reserved successfully"})


# -----------------------
# Complete Week
# -----------------------
@app.route("/complete-week", methods=["POST"])
def complete_week():
    data = request.json

    progress = Progress.query.filter_by(
        student_id=data["student_id"],
        course_id=data["course_id"]
    ).first()

    if not progress:
        return jsonify({"message": "Progress not found"}), 404

    course = Course.query.get(data["course_id"])

    if progress.completed_weeks < course.duration_weeks:
        progress.completed_weeks += 1
        db.session.commit()

    return jsonify({"message": "Week marked as completed"})


# -----------------------
# Get Progress
# -----------------------
@app.route("/progress/<int:student_id>", methods=["GET"])
def get_progress(student_id):
    progresses = Progress.query.filter_by(student_id=student_id).all()

    result = []

    for p in progresses:
        course = Course.query.get(p.course_id)

        percent = (p.completed_weeks / course.duration_weeks) * 100

        result.append({
            "course_id": course.id,
            "title": course.title,
            "completed_weeks": p.completed_weeks,
            "total_weeks": course.duration_weeks,
            "percentage": round(percent, 2)
        })

    return jsonify(result)


# -----------------------
# Get Student Reservations
# -----------------------
@app.route("/my-reservations/<int:student_id>", methods=["GET"])
def get_my_reservations(student_id):
    reservations = Reservation.query.filter_by(student_id=student_id).all()

    result = []
    for r in reservations:
        course = Course.query.get(r.course_id)

        result.append({
            "reservation_id": r.id,
            "course_id": course.id,
            "title": course.title,
            "description": course.description
        })

    return jsonify(result)


# -----------------------
# Cancel Reservation
# -----------------------
@app.route("/cancel-reservation/<int:reservation_id>", methods=["DELETE"])
def cancel_reservation(reservation_id):
    reservation = Reservation.query.get(reservation_id)

    if not reservation:
        return jsonify({"message": "Reservation not found"}), 404

    # Delete progress also
    Progress.query.filter_by(
        student_id=reservation.student_id,
        course_id=reservation.course_id
    ).delete()

    db.session.delete(reservation)
    db.session.commit()

    return jsonify({"message": "Reservation cancelled successfully"})



# -----------------------
# Get All Users (Admin)
# -----------------------
@app.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()

    result = []
    for u in users:
        result.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role
        })

    return jsonify(result)

# -----------------------
# Delete User (Admin)
# -----------------------
@app.route("/delete-user/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):

    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Prevent deleting admin
    if user.role == "admin":
        return jsonify({"message": "Admin cannot be deleted"}), 403

    # Delete related data
    Reservation.query.filter_by(student_id=user_id).delete()
    Progress.query.filter_by(student_id=user_id).delete()
    Course.query.filter_by(instructor_id=user_id).delete()

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted successfully"})



# -----------------------
# Seed Users + Courses
# -----------------------
@app.route("/seed-courses")
def seed_courses():

    if User.query.count() > 0:
        return {"message": "Data already seeded"}

    # Sample Users
    users = [
        User(name="Student User",
             email="student@test.com",
             password=generate_password_hash("123456"),
             role="student"),

        User(name="Teacher User",
             email="teacher@test.com",
             password=generate_password_hash("123456"),
             role="teacher"),

        User(name="Admin User",
             email="admin@test.com",
             password=generate_password_hash("123456"),
             role="admin"),
    ]

    for u in users:
        db.session.add(u)

    db.session.commit()

    teacher = User.query.filter_by(role="teacher").first()

    python_schedule = json.dumps([f"Week {i} - Python Video https://youtube.com" for i in range(1, 13)])
    java_schedule = json.dumps([f"Week {i} - Java Video https://youtube.com" for i in range(1, 13)])
    ui_schedule = json.dumps([f"Week {i} - UI Video https://youtube.com" for i in range(1, 13)])

    courses = [
        Course(title="Python Programming",
               description="Complete Python Course",
               fee=1999,
               duration_weeks=12,
               schedule=python_schedule,
               instructor_id=teacher.id),

        Course(title="Java Programming",
               description="Complete Java Course",
               fee=2499,
               duration_weeks=12,
               schedule=java_schedule,
               instructor_id=teacher.id),

        Course(title="UI Development",
               description="Frontend Development Course",
               fee=2999,
               duration_weeks=12,
               schedule=ui_schedule,
               instructor_id=teacher.id),
    ]

    for c in courses:
        db.session.add(c)

    db.session.commit()

    return {"message": "Users and Courses Seeded Successfully"}


if __name__ == "__main__":
    app.run(debug=True)