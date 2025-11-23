import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: "1.1rem", marginRight: "0.5rem" }}>
          HRMS
        </span>
        {user && (
          <span className="badge">
            Org #{user.organisationId}
          </span>
        )}
      </div>
      <div className="nav-links">
        {user ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/employees">Employees</NavLink>
            <NavLink to="/teams">Teams</NavLink>
            <NavLink to="/logs">Logs</NavLink>
            <button className="btn-secondary" style={{ marginLeft: "0.6rem" }} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </div>
    </div>
  );
}
