import express from "express";
import {
  listAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementsCount,
  getAnnouncementAnalytics,
} from "../controllers/announcement.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public read
router.get("/", listAnnouncements);

// Admin-only create and delete
router.post("/", protectRoute, adminRoute, createAnnouncement);
router.delete("/:id", protectRoute, adminRoute, deleteAnnouncement);

// Analytics endpoints (admin only)
router.get("/count", protectRoute, adminRoute, getAnnouncementsCount);
router.get("/analytics", protectRoute, adminRoute, getAnnouncementAnalytics);

export default router;
