import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

// routes
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import searchRoutes from "./routes/search.route.js";
import announcementRoutes from "./routes/announcement.route.js";
import voteRoutes from "./routes/vote.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Initialize database connection (no await at top level)
let dbConnected = false;
const initializeDB = async () => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database connection failed:", error);
    }
  }
};

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
  await initializeDB();
  next();
});

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Emporio Backend is running!",
    status: "success",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    database: dbConnected ? "connected" : "disconnected",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/user", userRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/analytics", analyticsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("=== SERVER ERROR ===");
  console.error(err.stack);
  console.error("==================");
  res.status(500).json({
    message: "Internal Server Error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// Static files for production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  // ✅ Fixed wildcard route for Express v5
  app.get("/*catchall", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// Export for Vercel
export default app;

// Only listen locally
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, async () => {
    console.log("SERVER is running on http://localhost:" + PORT);
    await initializeDB();
  });
}
