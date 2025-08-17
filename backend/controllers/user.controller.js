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
