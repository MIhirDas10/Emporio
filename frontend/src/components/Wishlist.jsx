import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Vote, CheckCircle2, RotateCcw } from "lucide-react";
import axios from "axios";
import { useUserStore } from "../stores/useUserStore"; // Your auth store

const Wishlist = () => {
  const [selected, setSelected] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [votedProductIds, setVotedProductIds] = useState(new Set());

  const { user } = useUserStore(); // Get logged-in user

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchUserVotes();
    } else {
      setVotedProductIds(new Set()); // Clear votes if not logged in
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/votes/products-with-votes");
      if (response.data.success) {
        setProducts(response.data.data || []);
      } else {
        setProducts([]);
      }
    } catch {
      setProducts([]);
    } finally {
    }
  };

  const fetchUserVotes = async () => {
    if (!user) return;

    try {
      const response = await axios.get(
        `/api/votes/user/${user._id}/voted-products`
      );
      if (response.data.success) {
        setVotedProductIds(new Set(response.data.productIds));
      }
    } catch (error) {
      console.error("Error fetching user votes:", error);
    }
  };

  const toggleSelection = (id) => {
    if (!user) {
      toast.error("Please log in to vote");
      return;
    }

    if (votedProductIds.has(id)) {
      toast.error("You have already voted for this product");
      return;
    }

    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please log in to vote");
      return;
    }

    if (selected.length === 0) return;

    setLoading(true);
    try {
      const response = await axios.post("/api/votes/vote", { selected });
      if (response.data.success) {
        setVotedProductIds(
          (prev) => new Set([...Array.from(prev), ...selected])
        );

        setSelected([]);
        await fetchProducts(); // Refresh vote counts
        toast.success("Voted successfully!");
      } else {
        toast.error(response.data.message || "Failed to vote");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to vote";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />

      <div
        className="bg-gray-900/95 backdrop-blur-md rounded-2xl p-3 max-w-sm mx-auto"
        style={{ background: "#030712" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-emerald-500/20 rounded-lg">
              <Vote size={18} className="text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Vote For Products
            </h3>
          </div>
          <button
            onClick={fetchProducts}
            className="text-emerald-400 hover:text-emerald-300 transition-colors p-1 rounded"
            title="Refresh wishlist"
          ></button>
        </div>

        <div className="space-y-1 mb-6">
          {products.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-sm font-medium mb-1">
                No products available for voting
              </p>
            </div>
          ) : (
            products.map((product) => {
              const isSelected = selected.includes(product._id);
              const alreadyVoted = votedProductIds.has(product._id);

              return (
                <div
                  key={product._id}
                  onClick={() => toggleSelection(product._id)}
                  className={`
                    flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer
                    transition-all duration-200 border
                    ${
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : alreadyVoted
                        ? "bg-gray-700/50 border-gray-600 opacity-50 cursor-not-allowed"
                        : "bg-gray-800/40 border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/60"
                    }
                  `}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`
                        w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                        ${
                          isSelected
                            ? "bg-emerald-500 border-emerald-500"
                            : alreadyVoted
                            ? "border-gray-500 bg-gray-600"
                            : "border-gray-600 hover:border-gray-500"
                        }
                      `}
                    >
                      {isSelected && (
                        <CheckCircle2 size={12} className="text-white" />
                      )}
                      {alreadyVoted && !isSelected && (
                        <span className="text-xs text-gray-400">✓</span>
                      )}
                    </div>
                    <span
                      className={`
                        text-sm truncate transition-colors
                        ${
                          isSelected
                            ? "text-emerald-300 font-medium"
                            : alreadyVoted
                            ? "text-gray-400"
                            : "text-gray-300"
                        }
                      `}
                    >
                      {product.name}
                      {alreadyVoted && (
                        <span className="text-xs ml-1">(voted)</span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center ml-5 gap-1 text-xs font-medium">
                    <span className="text-emerald-400">
                      {product.votes || 0}
                    </span>
                    <span className="text-gray-500">votes</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={
            selected.length === 0 || loading || products.length === 0 || !user
          }
          className={`
            w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all
            ${
              selected.length > 0 && !loading && products.length > 0 && user
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          {!user
            ? "Login to vote"
            : loading
            ? "Submitting..."
            : selected.length > 0
            ? `Submit ${selected.length} Vote${
                selected.length === 1 ? "" : "s"
              }`
            : products.length === 0
            ? "No items available"
            : "Select items to vote"}
        </button>
      </div>
    </>
  );
};

export default Wishlist;
