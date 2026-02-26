import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav>
      <Link to="/">Home</Link>

      {role === "student" && <Link to="/courses">Courses</Link>}
      {role === "instructor" && <Link to="/instructor">Instructor Panel</Link>}
      {role === "admin" && <Link to="/admin">Admin Panel</Link>}

      <button onClick={logout}>Logout</button>
    </nav>
  );
}

export default Navbar;