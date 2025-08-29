import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trash,
  Edit3,
  Save,
  X,
  Crown,
  Users,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "../lib/axios";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    username: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/user/all");
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdate = async (userId, updateData) => {
    try {
      const response = await axios.put("/user/role", {
        userId,
        ...updateData,
      });

      setUsers(
        users.map((user) => (user._id === userId ? response.data : user))
      );
      setEditingUser(null);
      toast.success("User updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/user/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditForm({
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  };

  const handleSave = () => {
    handleUserUpdate(editingUser, editForm);
  };

  const handleCancel = () => {
    setEditingUser(null);
    setEditForm({ name: "", username: "", email: "", role: "" });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
            <Users className="text-emerald-500" size={20} />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-100">
              Users Management
            </h2>
            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-xs sm:text-sm">
              {filteredUsers.length} users
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
              placeholder="Search users..."
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
          {filteredUsers.map((user) => (
            <div key={user._id} className="bg-gray-900 p-4">
              {/* User Basic Info */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {user.profilePicture ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                      src={user.profilePicture}
                      alt={user.name}
                    />
                  ) : (
                    <div className="h-10 w-10 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-400 font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    {editingUser === user._id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                          placeholder="Name"
                        />
                        <input
                          type="text"
                          value={editForm.username}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              username: e.target.value,
                            })
                          }
                          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-400 text-sm"
                          placeholder="Username"
                        />
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-300 text-sm"
                          placeholder="Email"
                        />
                        <select
                          value={editForm.role}
                          onChange={(e) =>
                            setEditForm({ ...editForm, role: e.target.value })
                          }
                          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <div className="text-white text-sm font-medium truncate">
                          {user.name}
                        </div>
                        <div className="text-gray-400 text-xs truncate">
                          @{user.username}
                        </div>
                        <div className="text-gray-400 text-xs truncate mt-1">
                          {user.email}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Role Badge */}
                <div className="flex-shrink-0 ml-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                      user.role === "admin"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {user.role === "admin" && <Crown size={10} />}
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
                <span>{user.cartItems?.length || 0} cart items</span>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {editingUser === user._id ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors"
                    >
                      <Save size={14} />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(user)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors"
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors"
                    >
                      <Trash size={14} />
                      Delete
                    </button>
                  </>
                )}
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
              {["User", "Email", "Role", "Cart Items", "Joined", "Actions"].map(
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
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-800 transition">
                {/* User Info */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {user.profilePicture ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={user.profilePicture}
                        alt={user.name}
                      />
                    ) : (
                      <div className="h-10 w-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <span className="text-emerald-400 font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      {editingUser === user._id ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm w-32"
                          />
                          <input
                            type="text"
                            value={editForm.username}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                username: e.target.value,
                              })
                            }
                            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-400 text-xs w-32"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="text-white text-sm font-medium">
                            {user.name}
                          </div>
                          <div className="text-gray-400 text-xs">
                            @{user.username}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-4">
                  {editingUser === user._id ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-300 text-sm w-48"
                    />
                  ) : (
                    <div className="text-sm text-gray-300">{user.email}</div>
                  )}
                </td>

                {/* Role */}
                <td className="px-6 py-4">
                  {editingUser === user._id ? (
                    <select
                      value={editForm.role}
                      onChange={(e) =>
                        setEditForm({ ...editForm, role: e.target.value })
                      }
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                        user.role === "admin"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {user.role === "admin" && <Crown size={12} />}
                      {user.role}
                    </span>
                  )}
                </td>

                {/* Cart Items */}
                <td className="px-6 py-4 text-sm text-gray-300">
                  {user.cartItems?.length || 0} items
                </td>

                {/* Joined Date */}
                <td className="px-6 py-4 text-sm text-gray-300">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {editingUser === user._id ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="text-green-400 hover:text-green-300 transition hover:scale-110"
                          title="Save changes"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-gray-400 hover:text-gray-300 transition hover:scale-110"
                          title="Cancel editing"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-400 hover:text-blue-300 transition hover:scale-110"
                          title="Edit user"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-400 hover:text-red-300 transition hover:scale-110"
                          title="Delete user"
                        >
                          <Trash size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-gray-900">
          <Users className="mx-auto text-gray-500 mb-4" size={48} />
          <p className="text-gray-400">No users found</p>
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

export default UsersList;
