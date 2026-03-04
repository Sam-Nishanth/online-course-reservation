import React, { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function MyCourses() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get(`/my-courses/${user.id}`);
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // ✅ Delete Course Function Added
  const deleteCourse = async (id) => {
    try {
      await API.delete(`/delete-course/${id}`);
      alert("Course Deleted");
      fetchCourses(); // Refresh list after deletion
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div>
      <Navbar user={user} />
      <div style={{ padding: "20px" }}>
        <h2>My Created Courses</h2>

        {courses.length === 0 ? (
          <p>No courses created yet.</p>
        ) : (
          courses.map((course) => (
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

              {/* ✅ Delete Button */}
              <button
                onClick={() => deleteCourse(course.id)}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: "8px 12px",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Delete Course
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyCourses;