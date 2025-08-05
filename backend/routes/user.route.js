import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/user.controller.js";

const router = express.Router();
// router.put("/profile", protectRoute, updateProfile);

// GET current logged-in user's profile
router.get("/profile", protectRoute, (req, res) => {
  res.json(req.user);
});

// PUT update profile
router.put("/profile", protectRoute, updateProfile);

export default router;
