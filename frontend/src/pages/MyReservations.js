import React, { useEffect, useState } from "react";
import API from "../services/api";

function MyReservations() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    API.get("/my-reservations").then(res => setReservations(res.data));
  }, []);

  return (
    <div>
      <h2>My Reserved Courses</h2>
      {reservations.map((r, index) => (
        <p key={index}>Course ID: {r.course_id}</p>
      ))}
    </div>
  );
}

export default MyReservations;