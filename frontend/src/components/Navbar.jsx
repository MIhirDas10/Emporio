import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ShoppingCart,
  UserPlus,
  LogIn,
  Lock,
  User,
  HomeIcon,
  PartyPopperIcon,
  Search,
} from "lucide-react";
import axios from "axios";

import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const { cart, getCartItems } = useCartStore();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  // const [results, setResults] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      getCartItems();
    }
  }, [user, getCartItems]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 border-b border-emerald-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-emerald-400 flex items-center space-x-2"
            >
              Emporio
            </Link>

            <nav className="flex items-center gap-4 relative">
              <div className="hidden sm:flex items-center bg-gray-800 rounded-full px-3 py-1 w-64">
                <Search
                  size={22}
                  className="text-gray-400 mr-2 cursor-pointer"
                  onClick={() => {
                    if (query.trim()) {
                      navigate(`/search?query=${encodeURIComponent(query)}`);
                    }
                  }}
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="bg-transparent focus:outline-none text-sm text-white w-full"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && query.trim()) {
                      navigate(`/search?query=${encodeURIComponent(query)}`);
                    }
                  }}
                />
              </div>
              <Link
                to="/"
                className="text-gray-300 hover:text-emerald-400 transition duration-300"
              >
                <HomeIcon size={24} />
              </Link>

              {user && (
                <>
                  {/* cart */}
                  <Link
                    to="/cart"
                    className="relative mr-2 text-gray-300 hover:text-emerald-400 transition duration-300"
                  >
                    <ShoppingCart size={22} />
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-3 bg-emerald-500 text-white rounded-full px-1.5 py-0.5 text-xs">
                        {cart.length}
                      </span>
                    )}
                  </Link>

                  {/* dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowDropdown((prev) => !prev)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full hover:ring-2 ring-emerald-500 transition"
                    >
                      {user?.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.username}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <img
                          src={`https://ui-avatars.com/api/?name=${
                            user?.username || "User"
                          }&background=059669&color=fff`}
                          alt="default avatar"
                          className="w-full h-full object-cover rounded-full"
                        />
                      )}
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 mt-2 bg-gray-800 border border-gray-700 rounded shadow-lg w-40 z-50">
                        <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                          {user.username}
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-200 hover:bg-emerald-600"
                        >
                          My Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {isAdmin && (
                <Link
                  to="/secret-dashboard"
                  className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium flex items-center transition duration-300"
                >
                  <Lock size={18} className="mr-2" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              )}

              {!user && (
                <>
                  <Link
                    to="/signup"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300"
                  >
                    <UserPlus size={18} className="mr-2" />
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300"
                  >
                    <LogIn size={18} className="mr-2" />
                    Login
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
