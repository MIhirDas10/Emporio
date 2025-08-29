import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  deleteUser,
  getAllUsers,
  updateProfile,
  updateUserRole,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", protectRoute, (req, res) => {
  res.json(req.user);
});

// PUT update profile
router.put("/profile", protectRoute, updateProfile);
router.put("/update", protectRoute, updateProfile);

// Admin routes
router.get("/all", protectRoute, getAllUsers);
router.put("/role", protectRoute, updateUserRole);
router.delete("/:userId", protectRoute, deleteUser);

export default router;
