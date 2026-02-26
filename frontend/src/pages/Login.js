import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "student"
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", form);

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", form.role);

      alert("Login successful");

      // Role-based navigation
      if (form.role === "admin") navigate("/admin");
      else if (form.role === "instructor") navigate("/instructor");
      else navigate("/courses");

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        {/* Role Selection */}
        <select onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;