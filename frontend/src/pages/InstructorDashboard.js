import React, { useState } from "react";
import API from "../services/api";

function InstructorDashboard({ user }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    fee: "",
    duration_weeks: "",
    schedule: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/courses", {
        ...form,
        instructor_id: user.id,
        schedule: JSON.stringify(form.schedule.split("\n")) // convert lines to array
      });

      alert("Course Created Successfully!");

      // Reset full form
      setForm({
        title: "",
        description: "",
        fee: "",
        duration_weeks: "",
        schedule: ""
      });

    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create New Course</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Course Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <br /><br />

        <textarea
          placeholder="Course Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <br /><br />

        {/* ✅ Fee Input */}
        <input
          type="number"
          placeholder="Course Fee"
          value={form.fee}
          onChange={(e) => setForm({ ...form, fee: e.target.value })}
        />
        <br /><br />

        {/* ✅ Duration Input */}
        <input
          type="number"
          placeholder="Duration (Weeks)"
          value={form.duration_weeks}
          onChange={(e) =>
            setForm({ ...form, duration_weeks: e.target.value })
          }
        />
        <br /><br />

        {/* ✅ Schedule Input */}
        <textarea
          placeholder="Weekly Topics (one per line)"
          value={form.schedule}
          onChange={(e) =>
            setForm({ ...form, schedule: e.target.value })
          }
        />
        <br /><br />

        <button type="submit">Create Course</button>
      </form>
    </div>
  );
}

export default InstructorDashboard;