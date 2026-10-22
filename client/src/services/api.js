import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// -------- Request interceptor --------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -------- Response interceptor --------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 = unauthorized, token expire / invalid
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Agar user login page pe nahi hai toh redirect
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/signup"
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;