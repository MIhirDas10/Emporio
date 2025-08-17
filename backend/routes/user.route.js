import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", protectRoute, (req, res) => {
  res.json(req.user);
});

// PUT update profile
router.put("/profile", protectRoute, updateProfile);
router.put("/update", protectRoute, updateProfile);

export default router;
