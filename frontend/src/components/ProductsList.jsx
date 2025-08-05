import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const ProductsList = () => {
  const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();

  return (
    <motion.div
      className="bg-white/5 backdrop-blur-md shadow-xl rounded-xl overflow-hidden max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            {["Product", "Price", "Category", "Featured", "Actions"].map(
              (head) => (
                <th
                  key={head}
                  className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider"
                >
                  {head}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {products?.map((product) => (
            <tr key={product._id} className="hover:bg-gray-800 transition">
              {/* name */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <img
                    className="h-10 w-10 rounded-md object-cover"
                    src={product.image}
                    alt={product.name}
                  />
                  <div className="text-white text-sm font-medium">
                    {product.name}
                  </div>
                </div>
              </td>

              {/* price */}
              <td className="px-6 py-4 text-sm text-gray-300">
                ${product.price.toFixed(2)}
              </td>

              {/* category */}
              <td className="px-6 py-4 text-sm text-gray-300">
                {product.category}
              </td>

              {/* featured */}
              <td className="px-6 py-4">
                <button
                  onClick={() => toggleFeaturedProduct(product._id)}
                  className={`p-1 rounded-full ${
                    product.isFeatured
                      ? "bg-yellow-400 text-gray-900"
                      : "bg-gray-700 text-gray-300"
                  } hover:scale-110 transition`}
                >
                  <Star className="h-5 w-5" />
                </button>
              </td>

              {/* delete */}
              <td className="px-6 py-4">
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ProductsList;
