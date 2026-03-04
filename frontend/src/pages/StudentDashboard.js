import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ Added
import API from "../services/api";

function StudentDashboard({ user }) {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();  // ✅ Initialize navigate

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses");
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const reserveCourse = async (courseId) => {
    try {
      await API.post("/reserve", {
        student_id: user.id,
        course_id: courseId,
      });

      alert("Course Reserved Successfully!");
    } catch (error) {
      console.error("Error reserving course:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Courses</h2>

      {courses.map((course) => (
        <div
          key={course.id}
          style={{
            border: "1px solid gray",
            margin: "10px",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <h3>{course.title}</h3>
          <p>{course.description}</p>

          {/* ✅ Reserve Button */}
          <button
            onClick={() => reserveCourse(course.id)}
            style={{ marginRight: "10px" }}
          >
            Reserve
          </button>

          {/* ✅ View Details Button */}
          <button onClick={() => navigate(`/course/${course.id}`)}>
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}

export default StudentDashboard;