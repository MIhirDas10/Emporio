import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  submitVotes,
  getTopVotedProducts,
  getProductsWithVotes,
  addWishlistItem,
  deleteWishlistItem,
  getUserVotedProducts, // NEW
} from "../controllers/vote.controller.js";

const router = express.Router();

router.get("/products-with-votes", getProductsWithVotes);
router.get("/top-voted", getTopVotedProducts);

// NEW: Get user's voted products
router.get("/user/:userId/voted-products", protectRoute, getUserVotedProducts);

router.post("/vote", protectRoute, submitVotes);
router.post("/wishlist-item", protectRoute, addWishlistItem);
router.delete("/wishlist-item/:id", protectRoute, deleteWishlistItem);

export default router;
