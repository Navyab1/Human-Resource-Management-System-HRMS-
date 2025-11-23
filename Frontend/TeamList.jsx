import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  fetchTeams,
  createTeamApi,
  updateTeamApi,
  deleteTeamApi
} from "../api/team.api.js";
import TeamForm from "../components/TeamForm.jsx";

export default function TeamList() {
  const { token } = useAuth();
  const [teams, setTeams] = useState([]);
  const [editingTeam, setEditingTeam] = useState(null);

  const loadData = async () => {
    if (!token) return;
    const res = await fetchTeams(token);
    if (res.success) setTeams(res.data);
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleCreate = async (data) => {
    const res = await createTeamApi(token, data);
    if (res.success) {
      setEditingTeam(null);
      await loadData();
    }
  };

  const handleUpdate = async (data) => {
    const res = await updateTeamApi(token, editingTeam.id, data);
    if (res.success) {
      setEditingTeam(null);
      await loadData();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this team?")) return;
    const res = await deleteTeamApi(token, id);
    if (res.success) {
      await loadData();
    }
  };

  return (
    <div className="app-shell">
      <TeamForm
        initialValues={editingTeam}
        onSubmit={editingTeam ? handleUpdate : handleCreate}
        onCancel={() => setEditingTeam(null)}
      />

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3 style={{ marginTop: 0 }}>Teams</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Employees</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.name}</td>
                  <td>{t.description}</td>
                  <td>{(t.Employees || []).map((e) => e.name).join(", ")}</td>
                  <td>
                    <button className="btn-secondary" onClick={() => setEditingTeam(t)}>
                      Edit
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ marginLeft: "0.4rem" }}
                      onClick={() => handleDelete(t.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {teams.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", color: "#6b7280" }}>
                    No teams yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
