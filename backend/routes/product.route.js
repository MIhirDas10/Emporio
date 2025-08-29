import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import {
  addReview,
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  getProductsByCategory,
  getPublicReviews,
  getRecommendedProduct,
  getReviews,
  toggleFeaturedProduct,
  updateProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

// gets all the product from db
router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProduct);
router.post("/", protectRoute, adminRoute, createProduct);
router.put("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.put("/update/:id", protectRoute, adminRoute, updateProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

// reviews
router.post("/:id/reviews", protectRoute, addReview);
router.get("/:id/reviews", protectRoute, getReviews);
router.get("/:id/reviews/public", getPublicReviews);
router.get("/single/:id", getProductById);

export default router;
