import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Post from "../models/post.model.js";
import Announcement from "../models/announcement.model.js";

export const getAnalytics = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments({
      isWishlistItem: { $ne: true },
    });
    const totalPosts = await Post.countDocuments();
    const totalAnnouncements = await Announcement.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    // Helper function to get daily counts
    async function getDailyCounts(Model, filter = {}) {
      const results = await Model.aggregate([
        { $match: { ...filter, createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const countsMap = {};
      results.forEach((r) => (countsMap[r._id] = r.count));

      const data = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(d.getDate() + i);
        const dateKey = d.toISOString().slice(0, 10);
        data.push({
          date: dateKey,
          count: countsMap[dateKey] || 0,
        });
      }
      return data;
    }

    // Get weekly data
    const dailyUsers = await getDailyCounts(User);
    const dailyProducts = await getDailyCounts(Product, {
      isWishlistItem: { $ne: true },
    });
    const dailyPosts = await getDailyCounts(Post);

    // Get top product categories
    const topCategories = await Product.aggregate([
      { $match: { isWishlistItem: { $ne: true } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, name: "$_id", count: 1 } },
    ]);

    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today },
    });

    res.json({
      totalUsers,
      totalProducts,
      totalPosts,
      totalAnnouncements,
      newUsersToday,
      dailyUsers,
      dailyProducts,
      dailyPosts,
      topCategories,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
