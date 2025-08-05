import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProduct,
  toggleFeaturedProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

// gets all the product from db
router.get("/", protectRoute, adminRoute, getAllProducts); // only admin can access this
router.get("/featured", getFeaturedProducts); // everyone can access this
router.get("/category/:category", getProductsByCategory); // everyone can access this
router.get("/recommendations", getRecommendedProduct); // everyone can access this
router.post("/", protectRoute, adminRoute, createProduct); // only admin can access this
router.put("/:id", protectRoute, adminRoute, toggleFeaturedProduct); // only admin can access this
router.delete("/:id", protectRoute, adminRoute, deleteProduct); // only admin can access this

export default router;
