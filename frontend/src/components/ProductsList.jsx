import { motion } from "framer-motion";
import { Trash, Edit, ShoppingBasket, Search } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { useState } from "react";

const ProductsList = ({ onEditProduct }) => {
  const { deleteProduct, products } = useProductStore();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products excluding wishlist items
  const actualProducts =
    products?.filter((product) => !product.isWishlistItem) || [];

  // Filter based on search term
  const filteredProducts = actualProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      className="bg-white/5 backdrop-blur-md shadow-xl rounded-xl overflow-hidden max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="bg-gray-800 px-4 sm:px-6 py-4 border-b border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShoppingBasket className="text-emerald-500" size={20} />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-100">
              Products Management
            </h2>
            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-xs sm:text-sm">
              {filteredProducts.length} products
            </span>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="block sm:hidden">
        <div className="divide-y divide-gray-700">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-gray-900 p-4">
              {/* Product Basic Info */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                    src={product.image}
                    alt={product.name}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-white text-sm font-medium truncate">
                      {product.name}
                    </div>
                    <div className="text-gray-400 text-xs truncate mt-1">
                      {product.description}
                    </div>
                    <div className="text-emerald-400 text-sm font-semibold mt-1">
                      ${product.price?.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="flex-shrink-0 ml-2">
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => onEditProduct(product)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors"
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors"
                >
                  <Trash size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {["Product", "Price", "Category", "Actions"].map((head) => (
                <th
                  key={head}
                  className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {filteredProducts.map((product) => (
              <motion.tr
                key={product._id}
                className="hover:bg-gray-800 transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Product Info */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                      src={product.image}
                      alt={product.name}
                    />
                    <div>
                      <div className="text-white text-sm font-medium">
                        {product.name}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {product.description?.substring(0, 60)}...
                      </div>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="px-6 py-4">
                  <div className="text-emerald-400 text-sm font-semibold">
                    ${product.price?.toFixed(2)}
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-4">
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                    {product.category}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditProduct(product)}
                      className="text-blue-400 hover:text-blue-300 transition hover:scale-110"
                      title="Edit product"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="text-red-400 hover:text-red-300 transition hover:scale-110"
                      title="Delete product"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-gray-900">
          <ShoppingBasket className="mx-auto text-gray-500 mb-4" size={48} />
          <p className="text-gray-400">No products found</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-2 text-emerald-400 hover:text-emerald-300 text-sm underline"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ProductsList;
