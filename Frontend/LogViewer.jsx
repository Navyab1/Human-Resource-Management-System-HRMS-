import React from "react";

export default function LogViewer({ logs }) {
  if (!logs || logs.length === 0) {
    return <p style={{ color: "#6b7280" }}>No logs found.</p>;
  }

  return (
    <div className="table-wrapper card">
      <h3 style={{ marginTop: 0 }}>Audit Log</h3>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User</th>
            <th>Action</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
              <td>{log.User?.email || "N/A"}</td>
              <td>{log.action}</td>
              <td>{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
