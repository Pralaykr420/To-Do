import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the logged-in user's JWT to every request, read fresh from
// localStorage each time so a login/logout is picked up immediately.
client.interceptors.request.use((config) => {
  const stored = localStorage.getItem("orbit_auth");
  if (stored) {
    try {
      const { token } = JSON.parse(stored);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // ignore malformed storage
    }
  }
  return config;
});

// Unwrap axios errors into readable messages
const handle = (promise) =>
  promise
    .then((res) => res.data.data)
    .catch((err) => {
      const message = err.response?.data?.message || err.message || "Something went wrong";
      throw new Error(message);
    });

export const fetchTasks = () => handle(client.get("/tasks"));

export const createTask = (task) => handle(client.post("/tasks", task));

export const updateTask = (id, updates) => handle(client.put(`/tasks/${id}`, updates));

export const toggleTask = (id) => handle(client.patch(`/tasks/${id}/toggle`));

export const deleteTask = (id) => handle(client.delete(`/tasks/${id}`));
