import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Student */}
        <Route path="/courses" element={role === "student" ? <StudentDashboard /> : <Navigate to="/login" />} />

        {/* Instructor */}
        <Route path="/instructor" element={role === "instructor" ? <InstructorDashboard /> : <Navigate to="/login" />} />

        {/* Admin */}
        <Route path="/admin" element={role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;