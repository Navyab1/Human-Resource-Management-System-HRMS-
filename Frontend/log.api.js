import { createAxiosInstance } from "./axiosInstance";

export async function fetchLogs(token, limit = 100) {
  const api = createAxiosInstance(token);
  const res = await api.get(`/logs?limit=${limit}`);
  return res.data;
}
