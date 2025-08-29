import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart, Star, Heart, Share2, ArrowLeft } from "lucide-react";
import ReviewForm from "../components/ReviewForm";
import ReviewsList from "../components/ReviewsList";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import toast from "react-hot-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useUserStore();
  const { addToCart } = useCartStore();

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/single/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products");
      return;
    }
    addToCart(product);
    toast.success("Added to cart!");
  };

  const handleReviewSubmitted = () => {
    fetchProduct();
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < Math.round(rating)
            ? "text-amber-400 fill-amber-400"
            : "text-gray-600"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4 mx-auto">
            <div className="w-8 h-8 border-2 border-gray-700 rounded"></div>
          </div>
          <p className="text-gray-500">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative">
        <div className="h-80 bg-gradient-to-br from-gray-900 to-black">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>

        {/* Floating Product Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md text-xs font-medium border border-emerald-500/30">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1">
                      {renderStars(product.averageRating || 0)}
                      <span className="text-xs text-gray-400 ml-1">
                        {product.averageRating
                          ? product.averageRating.toFixed(1)
                          : "0.0"}
                      </span>
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="text-right ml-6">
                  <div className="text-2xl font-bold mb-3">
                    {product.isFree ? (
                      <span className="text-emerald-400">Free</span>
                    ) : (
                      <span>${product.price}</span>
                    )}
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <ShoppingCart size={16} />
                    {product.isFree ? "Get" : "Added to cart!"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 bg-gray-900 rounded-xl p-1">
          {["overview", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-emerald-500 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {tab === "overview"
                ? "Overview"
                : `Reviews (${product.reviews?.length || 0})`}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pb-8">
          {activeTab === "overview" && (
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
              <h3 className="font-semibold mb-4">Product Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Category</span>
                    <p className="font-medium">{product.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Price</span>
                    <p className="font-medium">
                      {product.isFree ? "Free" : `$${product.price}`}
                    </p>
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Description</span>
                  <p className="text-gray-300 mt-1 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              {user && (
                <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
                  <h3 className="font-semibold mb-4">Write a Review</h3>
                  <ReviewForm
                    productId={product._id}
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                </div>
              )}

              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
                <h3 className="font-semibold mb-4">Customer Reviews</h3>
                <ReviewsList productId={product._id} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
