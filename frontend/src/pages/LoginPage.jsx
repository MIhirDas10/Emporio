import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading } = useUserStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = identifier.trim();
    const isEmail = trimmed.includes("@");
    const payload = {
      password: password.trim(),
      ...(isEmail ? { email: trimmed } : { username: trimmed }),
    };

    try {
      const loggedInUser = await login(payload); // login should return user
      if (loggedInUser?.role === "admin") {
        navigate("/secret-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-950 via-gray-900 to-gray-950">
      {/* left side image */}
      <div className="hidden lg:flex w-1/2 items-center justify-center relative ml-25 mt-12">
        <img
          src="/l7.gif"
          alt="Demo"
          className="max-w-lg w-3/4 rounded-xl opacity-90 mix-blend-screen drop-shadow-2xl"
        />
      </div>

      {/* right side login form */}
      <div className="flex flex-col justify-center py-12 px-6 lg:px-8 w-full lg:w-1/2 mr-35">
        <motion.div
          className="sm:mx-auto sm:w-full sm:max-w-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
            Login to your account
          </h2>
        </motion.div>

        <motion.div
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-gray-800/80 backdrop-blur-md py-8 px-6 shadow-xl sm:rounded-xl sm:px-10 border border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* username or email */}
              <div>
                <label
                  htmlFor="identifier"
                  className="block text-sm font-medium text-gray-300"
                >
                  Username or Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="identifier"
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="block w-full px-3 py-2 pl-10 bg-gray-700/60 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="Enter username or email"
                  />
                </div>
              </div>

              {/* password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300"
                >
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-3 py-2 pl-10 bg-gray-700/60 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Log in
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-400">
              Not a member?{" "}
              <Link
                to="/signup"
                className="font-medium text-emerald-400 hover:text-emerald-300"
              >
                Sign up now <ArrowRight className="inline h-4 w-4" />
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
