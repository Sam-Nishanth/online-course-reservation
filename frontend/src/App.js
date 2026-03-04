import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MyReservations from "./pages/MyReservations";
import MyCourses from "./pages/MyCourses";
import ManageUsers from "./pages/ManageUsers";
import CourseDetails from "./pages/CourseDetails";
import Progress from "./pages/Progress";
import MyReservationDetails from "./pages/MyReservationDetails";
import ManageCourses from "./pages/ManageCourses";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-reservations" element={<MyReservations />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/manage-courses" element={<ManageCourses />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/my-course/:courseId" element={<MyReservationDetails />} />
        
      </Routes>
    </Router>
  );
}

export default App;