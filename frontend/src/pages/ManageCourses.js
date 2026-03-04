import React, { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function ManageCourses() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await API.get("/courses");
    setCourses(res.data);
  };

  const deleteCourse = async (courseId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;

    await API.delete(`/delete-course/${courseId}`);
    fetchCourses();
  };

  return (
    <div>
      <Navbar user={user} />

      <div style={{ padding: "20px" }}>
        <h2>Manage Courses</h2>

        {/* Role Protection INSIDE JSX */}
        {user?.role !== "admin" ? (
          <h3 style={{ color: "red" }}>Access Denied</h3>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              style={{
                border: "1px solid #ddd",
                margin: "10px 0",
                padding: "15px",
                borderRadius: "6px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <h4>{course.title}</h4>
                <p>{course.description}</p>
                <p>Fee: ₹{course.fee}</p>
                <p>Duration: {course.duration_weeks} weeks</p>
              </div>

              <button
                onClick={() => deleteCourse(course.id)}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "8px 15px",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ManageCourses;