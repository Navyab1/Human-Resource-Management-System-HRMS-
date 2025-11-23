import { createAxiosInstance } from "./axiosInstance";

export async function fetchEmployees(token) {
  const api = createAxiosInstance(token);
  const res = await api.get("/employees");
  return res.data;
}

export async function createEmployeeApi(token, payload) {
  const api = createAxiosInstance(token);
  const res = await api.post("/employees", payload);
  return res.data;
}

export async function updateEmployeeApi(token, id, payload) {
  const api = createAxiosInstance(token);
  const res = await api.put(`/employees/${id}`, payload);
  return res.data;
}

export async function deleteEmployeeApi(token, id) {
  const api = createAxiosInstance(token);
  const res = await api.delete(`/employees/${id}`);
  return res.data;
}
