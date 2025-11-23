import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export async function registerOrg(payload) {
  const res = await axios.post(`${API_BASE_URL}/auth/register-org`, payload);
  return res.data;
}

export async function loginApi(payload) {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, payload);
  return res.data;
}
