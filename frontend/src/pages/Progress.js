import React, { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Progress() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  const res = await API.get(`/progress/${user.id}`);
  setReservations(res.data);
};

  return (
    <div>
      <Navbar user={user} />
      <div style={{ padding: "20px" }}>
        <h2>My Course Progress</h2>

        {reservations.map((course) => (
  <div key={course.course_id}
    style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}
  >
    <h3>{course.title}</h3>

    <div style={{ background: "#ddd", height: "20px", width: "100%" }}>
      <div
        style={{
          background: "green",
          width: `${course.percentage}%`,
          height: "100%"
        }}
      />
    </div>

    <p>{course.completed_weeks} / 12 Weeks Completed</p>
    <p>{course.percentage.toFixed(0)}% Completed</p>
  </div>
))}
      </div>
    </div>
  );
}

export default Progress;