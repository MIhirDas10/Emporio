import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Upload,
  Loader,
  Trophy,
  Plus,
  Trash2,
  X,
  RefreshCw,
} from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const categories = [
  "ebooks",
  "cheetsheets",
  "icons",
  "photos",
  "templates",
  "codesnippets",
];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    isFree: false,
  });

  const [topVotedProducts, setTopVotedProducts] = useState([]);
  const [loadingTopVotes, setLoadingTopVotes] = useState(false);
  const [showAddWishlistItem, setShowAddWishlistItem] = useState(false);
  const [newWishlistItem, setNewWishlistItem] = useState("");
  const [addingWishlistItem, setAddingWishlistItem] = useState(false);

  const { createProduct, loading } = useProductStore();

  useEffect(() => {
    fetchTopVotes();
  }, []);

  const fetchTopVotes = async () => {
    setLoadingTopVotes(true);
    try {
      const response = await axios.get("/api/votes/products-with-votes");
      if (response.data.success) {
        setTopVotedProducts(response.data.data.slice(0, 5));
      } else {
        setTopVotedProducts([]);
      }
    } catch {
      setTopVotedProducts([]);
    } finally {
      setLoadingTopVotes(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(newProduct);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        isFree: false,
      });
      fetchTopVotes();
      toast.success("Created");
    } catch {
      toast.error("Failed");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setNewProduct({ ...newProduct, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleAddWishlistItem = async (e) => {
    e.preventDefault();
    if (!newWishlistItem.trim()) return;
    setAddingWishlistItem(true);
    try {
      const response = await axios.post("/api/votes/wishlist-item", {
        name: newWishlistItem.trim(),
      });
      if (response.data.success) {
        setNewWishlistItem("");
        setShowAddWishlistItem(false);
        fetchTopVotes();
        toast.success("Created");
      } else {
        toast.error(response.data.message || "Failed");
      }
    } catch {
      toast.error("Failed");
    } finally {
      setAddingWishlistItem(false);
    }
  };

  const handleDeleteWishlistItem = async (productId) => {
    try {
      const response = await axios.delete(
        `/api/votes/wishlist-item/${productId}`
      );
      if (response.data.success) {
        fetchTopVotes();
        toast.success("Deleted");
      } else {
        toast.error(response.data.message || "Failed");
      }
    } catch {
      toast.error("Failed");
    }
  };

  const getRankIcon = (index) => {
    const colors = [
      "text-yellow-400",
      "text-gray-300",
      "text-amber-600",
      "text-blue-400",
      "text-purple-400",
    ];
    const bgColors = [
      "bg-yellow-400/10",
      "bg-gray-400/10",
      "bg-amber-600/10",
      "bg-blue-400/10",
      "bg-purple-400/10",
    ];
    const rankNumber = index + 1;
    return (
      <div
        className={`w-6 h-6 rounded-full ${bgColors[index]} flex items-center justify-center`}
      >
        <span className={`text-xs font-bold ${colors[index]}`}>
          {rankNumber}
        </span>
      </div>
    );
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-950">
        <motion.div
          className="max-w-7xl mx-auto p-2 sm:p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Mobile-First Layout */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Product Form */}
            <div className="w-full lg:flex-[7] order-1 lg:order-1">
              <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-emerald-400 flex items-center gap-2">
                  <PlusCircle size={18} className="sm:w-5 sm:h-5" />
                  Create New Product
                </h2>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-5"
                >
                  {/* Name and Price - Stack on Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, name: e.target.value })
                        }
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">
                        Price
                      </label>
                      <input
                        type="number"
                        value={newProduct.isFree ? 0 : newProduct.price}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            price: e.target.value,
                          })
                        }
                        step="0.01"
                        disabled={newProduct.isFree}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50"
                        required={!newProduct.isFree}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Category
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                        })
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Free Checkbox */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isFree"
                      checked={newProduct.isFree}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          isFree: e.target.checked,
                          price: e.target.checked ? 0 : newProduct.price,
                        })
                      }
                      className="h-4 w-4 text-emerald-500 bg-gray-800 border-gray-600 rounded focus:ring-emerald-500"
                    />
                    <label
                      htmlFor="isFree"
                      className="text-xs sm:text-sm text-gray-300"
                    >
                      Mark as free product
                    </label>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                      rows="3"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-3 text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                      required
                      placeholder="Describe your product..."
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Product Image
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        type="file"
                        id="image"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <label
                        htmlFor="image"
                        className="cursor-pointer bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg py-2.5 px-4 text-xs font-medium text-gray-300 flex items-center justify-center sm:justify-start gap-2 transition-colors"
                      >
                        <Upload size={14} />
                        Choose Image
                      </label>
                      {newProduct.image && (
                        <span className="text-xs text-emerald-400 flex items-center gap-1 justify-center sm:justify-start">
                          ✓ Image uploaded
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader className="animate-spin" size={16} />
                        Creating...
                      </>
                    ) : (
                      <>
                        <PlusCircle size={16} />
                        Create Product
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Wishlist Management - Shows after form on mobile */}
            <div className="w-full lg:flex-[3] order-2 lg:order-2">
              <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 sm:p-5 lg:sticky lg:top-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500/20 rounded-md flex items-center justify-center">
                      <Trophy
                        size={10}
                        className="sm:w-3 sm:h-3 text-emerald-400"
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-white">
                      Wishlist Management
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={fetchTopVotes}
                      disabled={loadingTopVotes}
                      className="text-emerald-400 hover:text-emerald-300 p-1 transition-colors"
                      title="Refresh wishlist"
                    >
                      <RefreshCw
                        size={14}
                        className={loadingTopVotes ? "animate-spin" : ""}
                      />
                    </button>
                    <button
                      onClick={() =>
                        setShowAddWishlistItem(!showAddWishlistItem)
                      }
                      className="text-emerald-400 hover:text-emerald-300 transition-colors"
                      title="Add new wishlist item"
                    >
                      {showAddWishlistItem ? (
                        <X size={16} />
                      ) : (
                        <Plus size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Wishlist Item Form */}
                {showAddWishlistItem && (
                  <form
                    onSubmit={handleAddWishlistItem}
                    className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50"
                  >
                    <input
                      type="text"
                      value={newWishlistItem}
                      onChange={(e) => setNewWishlistItem(e.target.value)}
                      placeholder="Enter product name for voting..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white text-xs mb-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={addingWishlistItem || !newWishlistItem.trim()}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-1.5 px-3 rounded-md text-xs flex items-center justify-center gap-1 transition-colors"
                      >
                        {addingWishlistItem ? (
                          <Loader className="animate-spin" size={12} />
                        ) : (
                          <Plus size={12} />
                        )}
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddWishlistItem(false);
                          setNewWishlistItem("");
                        }}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md text-xs transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Wishlist Items */}
                {loadingTopVotes ? (
                  <div className="text-center text-gray-400 py-6">
                    <Loader className="animate-spin mx-auto mb-2" size={20} />
                    <p className="text-xs">Loading data...</p>
                  </div>
                ) : topVotedProducts.length === 0 ? (
                  <div className="text-center text-gray-400 py-6">
                    <div className="text-2xl mb-2">📊</div>
                    <p className="text-xs">No wishlist items yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {topVotedProducts.map((product, index) => (
                      <div
                        key={product._id}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:bg-gray-800/70 group transition-colors"
                      >
                        {getRankIcon(index)}
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-xs font-medium truncate">
                            {product.name}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-emerald-400 font-bold text-sm">
                            {product.votes || 0}
                          </div>
                          <button
                            onClick={() =>
                              handleDeleteWishlistItem(product._id)
                            }
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 p-1 transition-opacity"
                            title="Remove from wishlist"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default CreateProductForm;
