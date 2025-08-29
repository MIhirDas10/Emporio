import { useState, useEffect } from "react";
import { Trophy, TrendingUp } from "lucide-react";
import axios from "axios";

const TopVotedProducts = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopVoted();
  }, []);

  const fetchTopVoted = async () => {
    try {
      const response = await axios.get("/api/votes/top-voted");
      if (response.data.success) {
        setTopProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching top voted products:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    const colors = ["text-yellow-400", "text-gray-300", "text-amber-600"];
    return (
      <div className={`text-2xl font-bold ${colors[index] || "text-gray-500"}`}>
        #{index + 1}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl p-6 max-w-2xl mx-auto">
        <div className="text-center text-gray-300">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-emerald-500/20 rounded-lg">
          <Trophy size={24} className="text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Top Voted Products</h2>
      </div>

      <div className="space-y-4">
        {topProducts.map((product, index) => (
          <div
            key={product._id}
            className="flex items-center justify-between p-4 bg-gray-800/40 border border-gray-700/50 rounded-lg"
          >
            <div className="flex items-center gap-4">
              {getRankIcon(index)}
              <div>
                <h3 className="text-lg font-medium text-white">
                  {product.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <span className="text-xl font-bold text-emerald-400">
                {product.votes}
              </span>
              <span className="text-gray-400">votes</span>
            </div>
          </div>
        ))}

        {topProducts.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No votes yet! Encourage users to start voting.
          </div>
        )}
      </div>
    </div>
  );
};

export default TopVotedProducts;
