import React, { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function MyReservations() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);
  const navigate = useNavigate();

  const fetchReservations = async () => {
    try {
      const res = await API.get(`/my-reservations/${user.id}`);
      setReservations(res.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  // ✅ Cancel Reservation Function Added
  const cancelReservation = async (id) => {
    try {
      await API.delete(`/cancel-reservation/${id}`);
      alert("Reservation Cancelled");
      fetchReservations(); // refresh list after cancellation
    } catch (error) {
      console.error("Error cancelling reservation:", error);
    }
  };

  return (
    <div>
      <Navbar user={user} />
      <div style={{ padding: "20px" }}>
        <h2>My Reserved Courses</h2>

        {reservations.length === 0 ? (
          <p>No reservations yet.</p>
        ) : (
          reservations.map((course) => (
            <div
              key={course.reservation_id}
              style={{
                border: "1px solid gray",
                margin: "10px",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <button onClick={() => navigate(`/my-course/${course.course_id}`)}>View Course</button>

              {/* ✅ Cancel Button */}
              <button
                onClick={() => cancelReservation(course.reservation_id)}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: "8px 12px",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Cancel Reservation
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyReservations;