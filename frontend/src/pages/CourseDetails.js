import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function CourseDetails() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [course, setCourse] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    const res = await API.get(`/course/${id}`);
    setCourse(res.data);
  };

  const enrollCourse = async () => {
    await API.post("/reserve", {
      student_id: user.id,
      course_id: course.id
    });

    alert("Enrolled Successfully!");
  };

  if (!course) return <h3>Loading...</h3>;

  const schedule = JSON.parse(course.schedule || "[]");

  return (
    <div>
      <Navbar user={user} />
      <div style={{ padding: "20px" }}>
        <h1>{course.title}</h1>
        <p>{course.description}</p>

        <h3>Duration: {course.duration_weeks} Weeks</h3>
        <h3>Fee: ₹{course.fee}</h3>

        <h2>Weekly Schedule</h2>

        {schedule.map((week, index) => (
          <div key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px"
            }}
          >
            <h4>Week {index + 1}</h4>
            <p>{week}</p>
          </div>
        ))}

        <button onClick={enrollCourse}>
          Enroll
        </button>
      </div>
    </div>
  );
}

export default CourseDetails;