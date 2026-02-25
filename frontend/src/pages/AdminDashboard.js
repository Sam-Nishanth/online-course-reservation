import React, { useState } from "react";
import API from "../services/api";

function AdminDashboard() {
  const [course, setCourse] = useState({
    title: "",
    instructor: "",
    duration: "",
    seats: ""
  });

  const addCourse = async () => {
    await API.post("/courses", course);
    alert("Course Added");
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <input placeholder="Title" onChange={e => setCourse({...course, title:e.target.value})} />
      <input placeholder="Instructor" onChange={e => setCourse({...course, instructor:e.target.value})} />
      <input placeholder="Duration" onChange={e => setCourse({...course, duration:e.target.value})} />
      <input placeholder="Seats" onChange={e => setCourse({...course, seats:e.target.value})} />
      <button onClick={addCourse}>Add Course</button>
    </div>
  );
}

export default AdminDashboard;