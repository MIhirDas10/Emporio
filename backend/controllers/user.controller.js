import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "username",
      "profilePicture",
      "email",
      "password",
    ];
    const updatedData = {};
    for (const field of allowedFields) {
      if (req.body[field]) {
        updatedData[field] = req.body[field];
      }
    }

    // for cloudinary -> profile picture
    if (req.body.profilePicture) {
      const result = await cloudinary.uploader.upload(req.body.profilePicture);
      updatedData.profilePicture = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updatedData },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (error) {
    console.log("Error in updateProfile controller: ", error);
    res.status(500).json({ message: "Server error" });
  }
};
