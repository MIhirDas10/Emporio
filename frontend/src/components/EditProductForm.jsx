import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProductStore } from "../stores/useProductStore";
import {
  Upload,
  Loader,
  X,
  Save,
  Image as ImageIcon,
  Package,
  DollarSign,
  FileText,
  Tag,
  AlertCircle,
} from "lucide-react";

const EditProductForm = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image: product.image,
  });

  const [imagePreview, setImagePreview] = useState(product.image);
  const [errors, setErrors] = useState({});
  const { updateProduct, loading } = useProductStore();

  const categories = [
    "ebooks",
    "cheetsheets",
    "icons",
    "photos",
    "templates",
    "codesnippets",
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Product name must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.image) {
      newErrors.image = "Product image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updateProduct(product._id, formData);
      onClose();
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, image: "Please select a valid image file" });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size must be less than 5MB" });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
        setImagePreview(reader.result);
        setErrors({ ...errors, image: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden shadow-2xl"
          style={{ marginTop: "60px" }}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="text-white" size={24} />
              <h2 className="text-2xl font-bold text-white">Edit Product</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors"
              disabled={loading}
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 max-h-[calc(95vh-80px)] overflow-y-auto custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Image */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                  <ImageIcon size={16} />
                  Product Image
                </label>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Image Preview */}
                  <div className="relative">
                    {imagePreview ? (
                      <div className="relative group">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="w-32 h-32 object-cover rounded-xl border-2 border-gray-700 shadow-lg"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                          <span className="text-white text-xs">
                            Click to change
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-32 h-32 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center">
                        <ImageIcon className="text-gray-500" size={32} />
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <div className="flex-1">
                    <input
                      type="file"
                      id="image"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <label
                      htmlFor="image"
                      className="cursor-pointer bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 py-3 px-4 rounded-xl shadow-sm text-sm font-medium text-gray-300 hover:text-white transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <Upload size={16} />
                      {imagePreview ? "Change Image" : "Upload Image"}
                    </label>
                    <p className="text-xs text-gray-400 mt-2">
                      Maximum 5MB. Supported: JPG, PNG, GIF, WEBP
                    </p>
                  </div>
                </div>

                {errors.image && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle size={16} />
                    {errors.image}
                  </div>
                )}
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Product Name */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                    <Package size={16} />
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-400 transition-all ${
                      errors.name
                        ? "border-red-500"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle size={16} />
                      {errors.name}
                    </div>
                  )}
                </motion.div>

                {/* Price */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                    <DollarSign size={16} />
                    Price
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      handleInputChange("price", parseFloat(e.target.value))
                    }
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-400 transition-all ${
                      errors.price
                        ? "border-red-500"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle size={16} />
                      {errors.price}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Category */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                  <Tag size={16} />
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all ${
                    errors.category
                      ? "border-red-500"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle size={16} />
                    {errors.category}
                  </div>
                )}
              </motion.div>

              {/* Description */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                  <FileText size={16} />
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-400 resize-none transition-all ${
                    errors.description
                      ? "border-red-500"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                  placeholder="Describe your product..."
                />
                <div className="flex justify-between items-center">
                  {errors.description ? (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle size={16} />
                      {errors.description}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">
                      {formData.description.length} characters
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex gap-4 pt-4 border-t border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-gray-300 font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/25"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Update Product
                    </>
                  )}
                </button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #374151 #1f2937;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
      `}</style>
    </AnimatePresence>
  );
};

export default EditProductForm;
