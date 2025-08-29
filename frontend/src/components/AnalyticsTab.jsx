import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ShoppingBasket,
  FileText,
  Megaphone,
  Activity,
  RefreshCw,
} from "lucide-react";
import axios from "../lib/axios";

const AnalyticsTab = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalPosts: 0,
    totalAnnouncements: 0,
    productsByCategory: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch real data from all endpoints
      const [usersRes, productsRes, postsRes, announcementsRes] =
        await Promise.allSettled([
          axios.get("/user/all"),
          axios.get("/products"),
          axios.get("/posts/count"),
          axios.get("/announcements/count"),
        ]);

      // Extract data safely
      const users = usersRes.status === "fulfilled" ? usersRes.value.data : [];
      const products =
        productsRes.status === "fulfilled"
          ? productsRes.value.data.products
          : [];
      const postsCount =
        postsRes.status === "fulfilled" ? postsRes.value.data.count : 0;
      const announcementsCount =
        announcementsRes.status === "fulfilled"
          ? announcementsRes.value.data.count
          : 0;

      // Filter out wishlist items
      const realProducts = products.filter(
        (product) => !product.isWishlistItem
      );

      // Count products by category
      const categoryCount = {};
      realProducts.forEach((product) => {
        if (product.category) {
          categoryCount[product.category] =
            (categoryCount[product.category] || 0) + 1;
        }
      });

      setStats({
        totalUsers: users.length,
        totalProducts: realProducts.length,
        totalPosts: postsCount,
        totalAnnouncements: announcementsCount,
        productsByCategory: categoryCount,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <motion.div
      className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:bg-gray-700 transition-colors"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
        <div>
          <div className="text-2xl font-bold text-white">
            {loading ? "..." : value.toLocaleString()}
          </div>
          <div className="text-gray-400 text-sm">{title}</div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="text-emerald-500" size={28} />
          <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <RefreshCw className={loading ? "animate-spin" : ""} size={16} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Users"
          value={stats.totalUsers}
          color="bg-blue-500"
        />
        <StatCard
          icon={ShoppingBasket}
          title="Total Products"
          value={stats.totalProducts}
          color="bg-emerald-500"
        />
        <StatCard
          icon={FileText}
          title="Total Posts"
          value={stats.totalPosts}
          color="bg-purple-500"
        />
        <StatCard
          icon={Megaphone}
          title="Announcements"
          value={stats.totalAnnouncements}
          color="bg-orange-500"
        />
      </div>

      {/* Simple Bar Chart for Products by Category */}
      {Object.keys(stats.productsByCategory).length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">
            Products by Category
          </h3>
          <div className="space-y-4">
            {Object.entries(stats.productsByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([category, count]) => (
                <div key={category} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-300 capitalize">
                    {category}
                  </div>
                  <div className="flex-1 bg-gray-700 rounded-full h-6 relative overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full flex items-center justify-end pr-2"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (count /
                            Math.max(
                              ...Object.values(stats.productsByCategory)
                            )) *
                          100
                        }%`,
                      }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <span className="text-white text-xs font-semibold">
                        {count}
                      </span>
                    </motion.div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Platform Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
          <div>
            <strong className="text-emerald-400">{stats.totalUsers}</strong>{" "}
            registered users
          </div>
          <div>
            <strong className="text-emerald-400">{stats.totalProducts}</strong>{" "}
            products available
          </div>
          <div>
            <strong className="text-emerald-400">{stats.totalPosts}</strong>{" "}
            community posts
          </div>
          <div>
            <strong className="text-emerald-400">
              {stats.totalAnnouncements}
            </strong>{" "}
            announcements
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsTab;
