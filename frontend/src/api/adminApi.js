import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Add token to headers
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// ✅ Use correct paths based on backend router
export const fetchUsers = () => API.get("/admin/users");
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);
export const updateUserRole = (id, data) => API.put(`/admin/users/${id}`, data);
export const fetchTotalUsers = () => API.get("/admin/users/count");
export const fetchTotalFiles = () => API.get("/admin/files/count");
