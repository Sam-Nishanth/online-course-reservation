import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/signup", form);
    alert("Signup successful");
    navigate("/login");
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" onChange={e => setForm({...form, name:e.target.value})} />
        <input placeholder="Email" onChange={e => setForm({...form, email:e.target.value})} />
        <input type="password" placeholder="Password" onChange={e => setForm({...form, password:e.target.value})} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Signup;