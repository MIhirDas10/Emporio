import React from "react";
import toast from "react-hot-toast";
import { ShoppingCart, Star } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products", { id: "login" });
      return;
    } else {
      addToCart(product);
    }
  };

  // Helper to render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={18}
          className={`${
            i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg bg-gray-900">
      {/* Image */}
      <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <img
          className="object-cover w-full"
          src={product.image}
          alt="product image"
        />
      </div>

      {/* Product Info */}
      <div className="mt-4 px-5 pb-5">
        <Link to={`/product/${product._id}`} className="block">
          <div className="flex items-center justify-between">
            <h5 className="text-xl font-semibold tracking-tight text-white hover:text-emerald-300 transition-colors">
              {product.name}
            </h5>

            <span
              className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
                product.price === 0
                  ? "bg-emerald-600 text-white"
                  : "bg-purple-600 text-white"
              }`}
            >
              {product.price === 0 ? "Free" : "Paid"}
            </span>
          </div>
        </Link>

        {/* Rating Section */}
        <div className="flex items-center mt-2">
          {renderStars(Math.round(product.averageRating || 0))}
          <span className="ml-2 text-sm text-gray-400">
            {product.averageRating ? product.averageRating.toFixed(1) : "0.0"}
          </span>
        </div>

        {/* Price Section */}
        <div className="mt-3 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-emerald-400">
              {product.isFree ? "Free" : `$${product.price}`}
            </span>
          </p>
        </div>

        {/* Action Button */}
        <button
          className="w-full flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-colors"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={18} className="mr-2" />
          {product.isFree ? "Get Now" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
