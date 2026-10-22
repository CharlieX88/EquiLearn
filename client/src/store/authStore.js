import { create } from "zustand";
import api from "../services/api";

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isLoading: false,
  isAuthenticated: !!localStorage.getItem("token"),

  // -------- Register --------
  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true, user: data.user };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  },

  // -------- Login --------
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true, user: data.user };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  },

  // -------- Logout --------
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // ignore errors on logout
    }
    localStorage.removeItem("token");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  // -------- Fetch current user --------
  fetchMe: async () => {
    const token = get().token;
    if (!token) return;
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data.user, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem("token");
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));

export default useAuthStore;