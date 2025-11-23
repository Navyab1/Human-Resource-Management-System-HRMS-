import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  fetchEmployees,
  createEmployeeApi,
  updateEmployeeApi,
  deleteEmployeeApi
} from "../api/employee.api.js";
import { fetchTeams, assignEmployeesApi } from "../api/team.api.js";
import EmployeeForm from "../components/EmployeeForm.jsx";

export default function EmployeeList() {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

  const loadData = async () => {
    if (!token) return;
    const [empRes, teamRes] = await Promise.all([
      fetchEmployees(token),
      fetchTeams(token)
    ]);
    if (empRes.success) setEmployees(empRes.data);
    if (teamRes.success) setTeams(teamRes.data);
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleCreate = async (data) => {
    const res = await createEmployeeApi(token, data);
    if (res.success) {
      setEditingEmployee(null);
      await loadData();
    }
  };

  const handleUpdate = async (data) => {
    const res = await updateEmployeeApi(token, editingEmployee.id, data);
    if (res.success) {
      setEditingEmployee(null);
      await loadData();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    const res = await deleteEmployeeApi(token, id);
    if (res.success) {
      await loadData();
    }
  };

  const toggleSelectedEmployee = (id) => {
    setSelectedEmployeeIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const assignSelectedEmployees = async () => {
    if (!selectedTeamId || selectedEmployeeIds.length === 0) return;
    await assignEmployeesApi(token, selectedTeamId, selectedEmployeeIds);
    await loadData();
  };

  return (
    <div className="app-shell">
      <EmployeeForm
        initialValues={editingEmployee}
        onSubmit={editingEmployee ? handleUpdate : handleCreate}
        onCancel={() => setEditingEmployee(null)}
      />

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3 style={{ marginTop: 0, marginBottom: "0.6rem" }}>Assign Employees to Team</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <div>
            <label>Target team</label>
            <br />
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
            >
              <option value="">-- select --</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <button onClick={assignSelectedEmployees} className="btn">
            Assign selected employees
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3 style={{ marginTop: 0 }}>Employees</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Select</th>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Position</th>
                <th>Teams</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedEmployeeIds.includes(e.id)}
                      onChange={() => toggleSelectedEmployee(e.id)}
                    />
                  </td>
                  <td>{e.id}</td>
                  <td>{e.name}</td>
                  <td>{e.email}</td>
                  <td>{e.position}</td>
                  <td>{(e.Teams || []).map((t) => t.name).join(", ")}</td>
                  <td>
                    <button className="btn-secondary" onClick={() => setEditingEmployee(e)}>
                      Edit
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ marginLeft: "0.4rem" }}
                      onClick={() => handleDelete(e.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", color: "#6b7280" }}>
                    No employees yet.
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
