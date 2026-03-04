import React, { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function ManageUsers() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data);
  };

  const deleteUser = async (id, role) => {
    if (role === "admin") {
      alert("Admin cannot be deleted");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/delete-user/${id}`);
      fetchUsers(); // refresh list
    } catch (error) {
      alert("Error deleting user");
    }
  };

  return (
    <div>
      <Navbar user={user} />

      <div style={{ padding: "20px" }}>
        <h2>Manage Users</h2>

        {users.map((u) => (
          <div
            key={u.id}
            style={{
              border: "1px solid #ddd",
              margin: "10px 0",
              padding: "15px",
              borderRadius: "6px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <h4>{u.name}</h4>
              <p>Email: {u.email}</p>
              <p>Role: {u.role}</p>
            </div>

            {u.role !== "admin" && (
              <button
                onClick={() => deleteUser(u.id, u.role)}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "8px 15px",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageUsers;