import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcryptjs";

export const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "username",
      "profilePicture",
      "bannerImg",
      "email",
      "password",
    ];
    const updatedData = {};

    for (const field of allowedFields) {
      if (
        req.body[field] &&
        field !== "profilePicture" &&
        field !== "bannerImg"
      ) {
        if (field === "password") {
          const salt = await bcrypt.genSalt(10);
          updatedData.password = await bcrypt.hash(req.body.password, salt);
        } else {
          updatedData[field] = req.body[field];
        }
      }
    }

    // profile pic
    if (req.body.profilePicture) {
      const result = await cloudinary.uploader.upload(req.body.profilePicture, {
        folder: "profile_images",
      });
      updatedData.profilePicture = result.secure_url;
    }

    // banner pic
    if (req.body.bannerImg) {
      const result = await cloudinary.uploader.upload(req.body.bannerImg, {
        folder: "banner_images",
      });
      updatedData.bannerImg = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updatedData },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    console.log("Error in updateProfile controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsersToday = await User.countDocuments({
      lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });
    const recentSignups = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    res.json({
      totalUsers,
      activeUsersToday,
      recentSignups,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.log("Error in getAllUsers controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Updated role function that handles name, username, email too
export const updateUserRole = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { userId, role, name, username, email } = req.body;

    // Build update object
    const updateObj = {};
    if (role && ["admin", "customer"].includes(role)) {
      updateObj.role = role;
    }
    if (name && name.trim()) {
      updateObj.name = name.trim();
    }
    if (username && username.trim()) {
      updateObj.username = username.trim();
    }
    if (email && email.trim()) {
      updateObj.email = email.toLowerCase().trim();
    }

    // Check for duplicates if updating username or email
    if (updateObj.username || updateObj.email) {
      const query = {
        $or: [],
        _id: { $ne: userId },
      };
      if (updateObj.username) query.$or.push({ username: updateObj.username });
      if (updateObj.email) query.$or.push({ email: updateObj.email });

      if (query.$or.length > 0) {
        const exists = await User.findOne(query);
        if (exists) {
          if (exists.username === updateObj.username) {
            return res.status(400).json({ message: "Username already exists" });
          }
          if (exists.email === updateObj.email) {
            return res.status(400).json({ message: "Email already exists" });
          }
        }
      }
    }

    if (Object.keys(updateObj).length === 0) {
      return res.status(400).json({ message: "No valid data to update" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateObj },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.log("Error in updateUserRole controller:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Error in deleteUser controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};
