import { createAxiosInstance } from "./axiosInstance";

export async function fetchTeams(token) {
  const api = createAxiosInstance(token);
  const res = await api.get("/teams");
  return res.data;
}

export async function createTeamApi(token, payload) {
  const api = createAxiosInstance(token);
  const res = await api.post("/teams", payload);
  return res.data;
}

export async function updateTeamApi(token, id, payload) {
  const api = createAxiosInstance(token);
  const res = await api.put(`/teams/${id}`, payload);
  return res.data;
}

export async function deleteTeamApi(token, id) {
  const api = createAxiosInstance(token);
  const res = await api.delete(`/teams/${id}`);
  return res.data;
}

export async function assignEmployeesApi(token, teamId, employeeIds) {
  const api = createAxiosInstance(token);
  const res = await api.post(`/teams/${teamId}/assign`, { employeeIds });
  return res.data;
}
