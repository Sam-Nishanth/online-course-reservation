import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function MyReservationDetails() {
  const { courseId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const [course, setCourse] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [currentVideo, setCurrentVideo] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchCourse();
    fetchProgress();
  }, []);

  const fetchCourse = async () => {
    const res = await API.get(`/course/${courseId}`);
    setCourse(res.data);

    const parsedSchedule = JSON.parse(res.data.schedule);
    setSchedule(parsedSchedule);

    if (parsedSchedule.length > 0) {
      setCurrentVideo(parsedSchedule[0]);
    }
  };

  const fetchProgress = async () => {
    const res = await API.get(`/progress/${user.id}`);
    const myCourse = res.data.find(
      (c) => c.course_id === parseInt(courseId)
    );

    if (myCourse) {
      setProgress(myCourse.percentage);
    }
  };

  const completeWeek = async () => {
    await API.post("/complete-week", {
      student_id: user.id,
      course_id: courseId
    });

    fetchProgress();
  };

  if (!course) return <div>Loading...</div>;

  return (
    <div>
      <Navbar user={user} />

      <div style={{ display: "flex", height: "90vh" }}>

        {/* LEFT SIDE - WEEK OUTLINE */}
        <div style={{
          width: "25%",
          background: "#f4f4f4",
          padding: "20px",
          overflowY: "auto",
          borderRight: "1px solid #ddd"
        }}>
          <h3>Course Outline</h3>

          {schedule.map((week, index) => (
            <div
              key={index}
              onClick={() => setCurrentVideo(week)}
              style={{
                padding: "10px",
                margin: "5px 0",
                cursor: "pointer",
                background: "#fff",
                borderRadius: "5px",
                border: "1px solid #ddd"
              }}
            >
              {week}
            </div>
          ))}
        </div>

        {/* RIGHT SIDE - VIDEO + DETAILS */}
        <div style={{
          width: "75%",
          padding: "30px"
        }}>
          <h2>{course.title}</h2>

          <div style={{ marginBottom: "20px" }}>
            <strong>Progress:</strong>
            <div style={{
              background: "#ddd",
              height: "20px",
              marginTop: "5px"
            }}>
              <div style={{
                width: `${progress}%`,
                height: "100%",
                background: "green"
              }} />
            </div>
            <p>{progress.toFixed(0)}% Completed</p>
          </div>

          <div style={{
            background: "#000",
            height: "400px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            borderRadius: "8px"
          }}>
            🎥 {currentVideo}
          </div>

          <button
            onClick={completeWeek}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Mark Week as Completed
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyReservationDetails;