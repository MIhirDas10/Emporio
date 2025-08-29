// models/announcement.model.js
import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: 1000,
    },
    pinned: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Optional scheduling window (not required to use)
    startsAt: { type: Date },
    endsAt: { type: Date },
  },
  { timestamps: true }
);

// For common sorting: pinned first, newest first
announcementSchema.index({ pinned: -1, createdAt: -1 });

const Announcement = mongoose.model("Announcement", announcementSchema);
export default Announcement;
