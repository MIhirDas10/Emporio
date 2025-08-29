// stores/useCommunityStore.js
import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { useUserStore } from "./useUserStore";

export const useCommunityStore = create((set, get) => ({
  posts: [],

  fetchPosts: async () => {
    try {
      const { data } = await axios.get("/posts");
      set({ posts: data });
    } catch (error) {
      toast.error("Failed to load posts");
    }
  },

  createPost: async (newPost) => {
    try {
      const { data } = await axios.post("/posts", newPost);

      // ✅ refresh user role immediately
      await useUserStore.getState().checkAuth();

      // update posts list optimistically
      set((state) => ({ posts: [data, ...state.posts] }));

      toast.success("Post created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
    }
  },
}));
