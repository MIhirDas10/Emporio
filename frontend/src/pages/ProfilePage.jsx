import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Edit3, Save, X, Camera } from "lucide-react";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const { user, logout, updateUser } = useUserStore();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(user || {});
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setEditedData(user);
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUser(editedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;

    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image file (JPEG, PNG, GIF)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      setUploadingImage(fieldName);

      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData((prev) => ({ ...prev, [fieldName]: reader.result }));
        setUploadingImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* banner */}
        <motion.div
          className="relative h-48 rounded-2xl overflow-hidden bg-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {editedData.bannerImg ? (
            <img
              src={editedData.bannerImg}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <Camera size={48} />
              <span className="ml-2">No banner image</span>
            </div>
          )}

          {isEditing && (
            <label className="absolute top-2 right-2 bg-gray-900/80 hover:bg-gray-800/80 text-sm px-3 py-1 rounded cursor-pointer transition-colors">
              {uploadingImage === "bannerImg"
                ? "Uploading..."
                : "Change Banner"}
              <input
                type="file"
                name="bannerImg"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={uploadingImage === "bannerImg"}
              />
            </label>
          )}
        </motion.div>

        {/* user Card */}
        <motion.div
          className="bg-gray-800 rounded-2xl shadow-lg p-6 mt-[-3rem] relative z-10 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-6">
            {/* profile pic */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-900">
                {editedData.profilePicture ? (
                  <img
                    src={editedData.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-400">
                    <User size={36} />
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 p-2 rounded-full cursor-pointer transition-colors">
                  {uploadingImage === "profilePicture" ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera size={16} />
                  )}
                  <input
                    type="file"
                    name="profilePicture"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={uploadingImage === "profilePicture"}
                  />
                </label>
              )}
            </div>

            {/* info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editedData.name || ""}
                    onChange={(e) =>
                      setEditedData((p) => ({ ...p, name: e.target.value }))
                    }
                    className="bg-gray-700 border border-gray-600 px-3 py-2 rounded-lg w-full focus:outline-none focus:border-blue-500"
                    placeholder="Full Name"
                  />
                  <input
                    type="text"
                    value={editedData.username || ""}
                    onChange={(e) =>
                      setEditedData((p) => ({ ...p, username: e.target.value }))
                    }
                    className="bg-gray-700 border border-gray-600 px-3 py-2 rounded-lg w-full focus:outline-none focus:border-blue-500"
                    placeholder="Username"
                  />
                  <input
                    type="email"
                    value={editedData.email || ""}
                    onChange={(e) =>
                      setEditedData((p) => ({ ...p, email: e.target.value }))
                    }
                    className="bg-gray-700 border border-gray-600 px-3 py-2 rounded-lg w-full focus:outline-none focus:border-blue-500"
                    placeholder="Email"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <p className="text-gray-400">@{user.username}</p>
                  <p className="text-gray-400 mb-2">{user.email}</p>
                  <span className="text-sm text-emerald-400 bg-emerald-900/50 px-3 py-1 rounded-full">
                    {user.role}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading || uploadingImage}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed px-6 py-2 rounded-lg transition-colors font-medium"
                >
                  <Save size={18} />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedData(user);
                  }}
                  disabled={loading || uploadingImage}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed px-6 py-2 rounded-lg transition-colors font-medium"
                >
                  <X size={18} /> Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors font-medium"
                >
                  <Edit3 size={18} /> Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition-colors font-medium"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
