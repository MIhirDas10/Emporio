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
  Layers,
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
      <header className="fixed top-0 left-0 w-full bg-gray-950/80 backdrop-blur-lg border-b border-gray-800/80 z-50 transition-all duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="group flex items-center space-x-2 hover:opacity-80 active:scale-95 transition-all duration-300"
            >
              {/* Clean SaaS-style Logo */}
              <div className="flex items-center gap-2.5">
                <div className="bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 p-2 rounded-xl text-emerald-400 group-hover:scale-105 transition-transform duration-300 border border-emerald-500/20">
                  <Layers size={22} strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold text-white tracking-tight drop-shadow-sm">
                  Emporio
                </span>
              </div>
            </Link>

            <nav className="flex items-center gap-4 relative">
              {user && !isAdmin && (
                <>
                  <div className="hidden md:flex items-center bg-gray-900/60 border border-gray-800 focus-within:border-emerald-500/50 focus-within:shadow-[0_0_15px_rgba(16,185,129,0.08)] rounded-full px-3 py-1.5 w-64 transition-all duration-300">
                    <Search
                      size={18}
                      className="text-gray-400 mr-2 cursor-pointer hover:text-emerald-400 transition-colors"
                      onClick={() => {
                        if (query.trim()) {
                          navigate(
                            `/search?query=${encodeURIComponent(query)}`
                          );
                        }
                      }}
                    />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search products..."
                      className="bg-transparent focus:outline-none text-sm text-white w-full placeholder-gray-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && query.trim()) {
                          navigate(
                            `/search?query=${encodeURIComponent(query)}`
                          );
                        }
                      }}
                    />
                  </div>
                </>
              )}
              {user && !isAdmin && (
                <>
                  <Link
                    to="/"
                    className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/5 rounded-full transition-all duration-300"
                    title="Home"
                  >
                    <HomeIcon size={22} />
                  </Link>
                </>
              )}

              {isAdmin && (
                <Link
                  to="/secret-dashboard"
                  className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/5 rounded-full transition-all duration-300"
                  title="Dashboard"
                >
                  <HomeIcon size={22} />
                </Link>
              )}

              {user && !isAdmin && (
                <>
                  <Link
                    to="/community"
                    className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/5 rounded-full transition-all duration-300"
                    title="Community"
                  >
                    <PartyPopperIcon size={22} />
                  </Link>
                </>
              )}

              {user && !isAdmin && (
                <>
                  {/* cart */}
                  <Link
                    to="/cart"
                    className="relative p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/5 rounded-full transition-all duration-300"
                    title="Shopping Cart"
                  >
                    <ShoppingCart size={21} />
                    {cart.length > 0 && (
                      <span className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full min-w-[16px] h-4 flex items-center justify-center text-[10px] font-bold px-1 animate-pulse">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </>
              )}
              {user && (
                <>
                  {/* dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowDropdown((prev) => !prev)}
                      className="w-9 h-9 flex items-center justify-center bg-gray-900 rounded-full border border-gray-800 hover:border-emerald-500 hover:ring-2 hover:ring-emerald-500/25 transition-all duration-300"
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
                          }&background=10B981&color=fff`}
                          alt="default avatar"
                          className="w-full h-full object-cover rounded-full"
                        />
                      )}
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 mt-3 bg-gray-900/95 border border-gray-800/80 backdrop-blur-md rounded-xl shadow-xl w-44 z-50 py-1 overflow-hidden">
                        <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-800 font-semibold bg-gray-950/20">
                          {user.username}
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors duration-200"
                        >
                          My Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {!user && (
                <div className="flex items-center gap-3">
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-2 px-5 rounded-full shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-95 flex items-center transition-all duration-300 text-sm"
                  >
                    <UserPlus size={16} className="mr-2" />
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="bg-gray-900 hover:bg-gray-850 border border-gray-800 hover:border-gray-750 text-white font-semibold py-2 px-5 rounded-full hover:scale-[1.02] active:scale-95 flex items-center transition-all duration-300 text-sm"
                  >
                    <LogIn size={16} className="mr-2" />
                    Login
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
