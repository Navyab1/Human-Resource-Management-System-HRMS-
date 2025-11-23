import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="app-shell">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Dashboard</h2>
        {user ? (
          <>
            <p style={{ marginBottom: "0.5rem" }}>
              Welcome, <strong>{user.email}</strong>
            </p>
            <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
              Use the navigation to manage <strong>Employees</strong>, <strong>Teams</strong> and
              view the <strong>Audit Logs</strong> for your organisation.
            </p>
          </>
        ) : (
          <p>Please login.</p>
        )}
      </div>
    </div>
  );
}
