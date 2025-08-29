import Announcement from "../models/announcement.model.js";

// Get all announcements (public)
export const listAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "username role")
      .sort({ pinned: -1, createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create new announcement (admin only)
export const createAnnouncement = async (req, res) => {
  try {
    const { title, message, pinned, startsAt, endsAt } = req.body;

    const announcement = new Announcement({
      title,
      message,
      pinned,
      createdBy: req.user._id,
      startsAt,
      endsAt,
    });

    await announcement.save();

    const populatedAnnouncement = await announcement.populate(
      "createdBy",
      "username role"
    );

    res.status(201).json(populatedAnnouncement);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete announcement (admin only)
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    await Announcement.findByIdAndDelete(id);

    res.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get announcements count for analytics
export const getAnnouncementsCount = async (req, res) => {
  try {
    const count = await Announcement.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get announcement analytics
export const getAnnouncementAnalytics = async (req, res) => {
  try {
    const totalAnnouncements = await Announcement.countDocuments();
    const pinnedAnnouncements = await Announcement.countDocuments({
      pinned: true,
    });

    res.json({
      totalAnnouncements,
      pinnedAnnouncements,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
