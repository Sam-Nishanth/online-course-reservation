import React, { useEffect, useState } from "react";
import API from "../services/api";

function Courses() {
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses");
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses", error);
    }
  };

  const reserveCourse = async (courseId) => {
    try {
      await API.post(
        `/reserve/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Course Reserved Successfully!");
    } catch (error) {
      alert("Reservation failed. Please login again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📚 Available Courses</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {courses.map((course) => (
          <div
            key={course.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              width: "250px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{course.title}</h3>
            <p><b>Instructor:</b> {course.instructor}</p>
            <p><b>Duration:</b> {course.duration}</p>
            <p><b>Seats:</b> {course.seats}</p>

            <button
              onClick={() => reserveCourse(course.id)}
              style={{
                marginTop: "10px",
                padding: "8px 12px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Reserve Course
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;