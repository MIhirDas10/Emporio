// useUserStore.js - Fixed version
import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useUserStore = create((set) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  // signup
  signup: async ({ name, username, email, password, confirmPassword }) => {
    set({ loading: true });
    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      const response = await axios.post("/auth/signup", {
        name,
        username,
        email,
        password,
      });
      set({ user: response.data.user, loading: false });
      toast.success("Signed up successfully");
      return response.data.user;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
      throw error;
    }
  },

  // login
  login: async ({ username, email, password }) => {
    set({ loading: true });
    try {
      const payload = {
        password,
        ...(email ? { email } : { username }),
      };
      const response = await axios.post("/auth/login", payload);
      set({ user: response.data.user, checkingAuth: false, loading: false });
      toast.success("Logged in successfully");
      return response.data.user;
    } catch (error) {
      set({ loading: false });
      toast.error(
        error?.response?.data?.message || "Login failed. An error occurred"
      );
      throw error;
    }
  },

  // logout
  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout"
      );
    }
  },

  // update profile
  updateUser: async (data) => {
    try {
      const response = await axios.put("/user/update", data);
      set({ user: response.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      throw error;
    }
  },

  // check auth
  checkAuth: async () => {
    set({ checkingAuth: true });

    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      // Only log non-401 errors to avoid console spam
      if (error.response?.status !== 401) {
        console.error("Auth check failed:", error);
      }
      set({ checkingAuth: false, user: null });
    }
  },
}));
