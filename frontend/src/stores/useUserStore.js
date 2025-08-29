import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
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
      await axios.post("/auth/signup", {
        name,
        username,
        email,
        password,
      });

      await get().checkAuth();
      set({ loading: false });
      toast.success("Signed up successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  // login
  // login: async ({ username, email, password }) => {
  //   set({ loading: true });

  //   try {
  //     const payload = {
  //       password,
  //       ...(email ? { email } : { username }),
  //     };

  //     await axios.post("/auth/login", payload);

  //     // fetch full user profile immediately after login
  //     await get().checkAuth();

  //     set({ loading: false });
  //     toast.success("Logged in successfully");
  //   } catch (error) {
  //     set({ loading: false });
  //     toast.error(
  //       error?.response?.data?.message || "Login failed. An error occurred"
  //     );
  //   }
  // },

  // login
  login: async ({ username, email, password }) => {
    set({ loading: true });

    try {
      const payload = {
        password,
        ...(email ? { email } : { username }),
      };

      await axios.post("/auth/login", payload);

      // fetch full user profile immediately after login
      await get().checkAuth();

      const loggedInUser = get().user; // get the user after authentication

      set({ loading: false });
      toast.success("Logged in successfully");

      return loggedInUser; // <-- return user so LoginPage can redirect based on role
    } catch (error) {
      set({ loading: false });
      toast.error(
        error?.response?.data?.message || "Login failed. An error occurred"
      );
      throw error; // throw error so LoginPage can handle it
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

  // to stay logged in
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
    }
  },

  // refresh token
  refreshToken: async () => {
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));

let refreshPromise = null;
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;
        return axios(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
