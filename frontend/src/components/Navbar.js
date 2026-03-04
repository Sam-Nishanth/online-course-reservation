import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ user }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={styles.navbar}>
      <h3 style={styles.logo}>Online Course System</h3>

      <div style={styles.menu}>
        {user.role === "student" && (
          <>
            <button onClick={() => navigate("/progress")}>Progress</button>
            <button onClick={() => navigate("/dashboard")}>Courses</button>
            <button onClick={() => navigate("/my-reservations")}>My Reservations</button>
          </>
        )}

        {user.role === "instructor" && (
          <>
            <button onClick={() => navigate("/dashboard")}>
              Create Course
            </button>
            <button onClick={() => navigate("/my-courses")}>
              My Courses
            </button>
          </>
        )}

        {user.role === "admin" && (
          <>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
            <button onClick={() => navigate("/manage-users")}>
              Manage Users
            </button>
            <button onClick={() => navigate("/manage-courses")}>
              Manage Courses
            </button>
          </>
        )}

        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#282c34",
    color: "white"
  },
  logo: {
    margin: 0
  },
  menu: {
    display: "flex",
    gap: "10px"
  },
  logout: {
    backgroundColor: "red",
    color: "white"
  }
};

export default Navbar;