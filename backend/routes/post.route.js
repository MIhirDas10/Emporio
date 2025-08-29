import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import {
  getFeedPosts,
  createPost,
  deletePost,
  getPostsCount,
  getPostAnalytics,
} from "../controllers/post.controller.js";

const router = express.Router();

// Get all posts
router.get("/", getFeedPosts);

// Create a post (protected)
router.post("/", protectRoute, createPost);

// Delete a post (protected)
router.delete("/:id", protectRoute, deletePost);

// Analytics endpoints (admin only)
router.get("/count", protectRoute, adminRoute, getPostsCount);
router.get("/analytics", protectRoute, adminRoute, getPostAnalytics);

export default router;
