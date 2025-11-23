import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchLogs } from "../api/log.api.js";
import LogViewer from "../components/LogViewer.jsx";

export default function LogsPage() {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);

  const loadLogs = async () => {
    if (!token) return;
    const res = await fetchLogs(token, 200);
    if (res.success) setLogs(res.data);
  };

  useEffect(() => {
    loadLogs();
  }, [token]);

  return (
    <div className="app-shell">
      <LogViewer logs={logs} />
    </div>
  );
}
