import React from "react";
import Navbar from "../components/Navbar";
import StudentDashboard from "./StudentDashboard";
import InstructorDashboard from "./InstructorDashboard";
import AdminDashboard from "./AdminDashboard";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div>
      <Navbar user={user} />

      <div style={{ padding: "20px" }}>
        <h1>Welcome, {user.name}</h1>

        {user.role === "student" && <StudentDashboard user={user} />}
        {user.role === "instructor" && <InstructorDashboard user={user} />}
        {user.role === "admin" && <AdminDashboard user={user} />}
      </div>
    </div>
  );
}

export default Dashboard;