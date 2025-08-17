import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SearchX, LayoutGrid, List } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { ShoppingCart } from "lucide-react";

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query") || "";
  const [results, setResults] = useState([]);
  const [view, setView] = useState("grid");
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/search?query=${query}`);
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mt-16 mb-6">
        <h2 className="text-2xl font-bold text-emerald-400">
          Search Results for "{query}"
        </h2>
        <button
          onClick={() => setView(view === "grid" ? "list" : "grid")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition"
        >
          {view === "grid" ? (
            <>
              <List className="w-4 h-4" /> List View
            </>
          ) : (
            <>
              <LayoutGrid className="w-4 h-4" /> Grid View
            </>
          )}
        </button>
      </div>

      {/* No Results */}
      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-12">
          <SearchX className="w-12 h-12 mb-4 text-gray-600" />
          <p className="text-lg">No products found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-lg shadow-sm p-3 hover:shadow-md transition"
            >
              <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-200">
                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 px-4 min-w-0">
                <h3 className="text-sm font-bold text-gray-800 dark:text-white truncate">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {product.description}
                </p>
                <div className="flex items-center gap-1 text-xs mt-1">
                  <span className="text-yellow-500">
                    {"⭐".repeat(product.rating || 4)}
                  </span>
                  <span className="text-gray-500">
                    ({product.ratingCount || 0})
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end w-24">
                <span className="text-base font-bold text-gray-900 dark:text-white">
                  {product.price === 0 ? "Free" : `$${product.price}`}
                </span>
                <button
                  onClick={() => addToCart(product)}
                  className="flex w-30 items-center te size-8 justify-center text-center mt-1 px-2 py-1 rounded-md bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-800 transition"
                >
                  <ShoppingCart size={22} className="mr-2" />
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
