import React, { useEffect, useState } from "react";
import API from "../services/api";

function CourseList() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    API.get("/courses").then(res => setCourses(res.data));
  }, []);

  const reserveCourse = async (id) => {
    await API.post(`/reserve/${id}`);
    alert("Course Reserved Successfully!");
  };

  return (
    <div>
      <h2>Available Courses</h2>
      {courses.map(course => (
        <div key={course.id} style={{border:"1px solid #ccc", margin:"10px", padding:"10px"}}>
          <h3>{course.title}</h3>
          <p>Instructor: {course.instructor}</p>
          <p>Duration: {course.duration}</p>
          <p>Seats: {course.seats}</p>
          <button onClick={() => reserveCourse(course.id)}>Reserve</button>
        </div>
      ))}
    </div>
  );
}

export default CourseList;