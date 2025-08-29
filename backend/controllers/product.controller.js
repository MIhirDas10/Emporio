import mongoose from "mongoose";
import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";

// gets all the product from db
export const getAllProducts = async (req, res) => {
  try {
    // Only get actual products, not wishlist items
    const products = await Product.find({
      isWishlistItem: { $ne: true }, // Exclude wishlist items
    });
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller ", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    // let featuredProducts = await mongoose.get("featured_products")
    const featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }
    res.json(featuredProducts);
  } catch (error) {
    console.log("Error in getFeaturedProducts controller ", error.message);
    res.status(500).json({ message: "Server error ", error: error.message });
  }
};

// creating products
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
      isWishlistItem: false, // Ensure this is an actual product, not a wishlist item
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("Error in createProduct controller ", error.message);
    res.status(500).json({ message: "Server error ", error: error.message });
  }
};

// deleting products
export const deleteProduct = async (req, res) => {
  try {
    // then it would be req.params.hello
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0]; // this will get the id
      try {
        // deleting from cloudinary bucket
        await cloudinary.uploader.destroy(`product/${publicId}`);
        console.log("Deleted image from cloudinary");
      } catch (error) {
        console.log("Error deleting image from cloudinary", error);
      }
    }

    // deleting from the database
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller ", error.message);
    res.status(500).json({ message: "Server error ", error: error.message });
  }
};

// recommended products
export const getRecommendedProduct = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        // this will get 3 products
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);

    res.json(products);
  } catch (error) {
    console.log("Error in getRecommendedProduct controller ", error.message);
    res.status(500).json({ message: "Server error ", error: error.message });
  }
};

// category
export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json({ products });
  } catch (error) {
    console.log("Error in getProductsByCategory controller ", error.message);
    res.status(500).json({ message: "Server error ", error: error.message });
  }
};

// toggle feature products
export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller ", error.message);
    res.status(500).json({ message: "Server error ", error: error.message });
  }
};

// review (customers only)
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id } = req.params; // product id
    const userId = req.user._id;

    if (req.user.role !== "customer") {
      return res
        .status(403)
        .json({ message: "Only customers can add reviews" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // check if already reviewed
    const alreadyReviewed = product.reviews.find(
      (rev) => rev.user.toString() === userId.toString()
    );
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You already reviewed this product" });
    }

    product.reviews.push({
      user: userId,
      rating,
      comment,
    });

    product.calculateAverageRating();
    await product.save();

    res.status(201).json({ message: "Review added", reviews: product.reviews });
  } catch (error) {
    console.log("Error in addReview controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get all reviews (admin only)
export const getReviews = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can view reviews" });
    }

    const { id } = req.params;
    const product = await Product.findById(id).populate(
      "reviews.user",
      "name email"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      averageRating: product.averageRating,
      reviews: product.reviews,
    });
  } catch (error) {
    console.log("Error in getReviews controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Public reviews (everyone can see)
export const getPublicReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("reviews.user", "name")
      .select("reviews averageRating");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      averageRating: product.averageRating,
      reviews: product.reviews,
      totalReviews: product.reviews.length,
    });
  } catch (error) {
    console.log("Error in getPublicReviews controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.log("Error in getProductById controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, category } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cloudinaryResponse = null;

    // Handle image update if new image is provided
    if (image && image !== product.image) {
      // Delete old image if it exists
      if (product.image) {
        const publicId = product.image.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(`products/${publicId}`);
        } catch (error) {
          console.log("Error deleting old image from cloudinary", error);
        }
      }

      // Upload new image
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: name || product.name,
        description: description || product.description,
        price: price !== undefined ? price : product.price,
        image: cloudinaryResponse?.secure_url || product.image,
        category: category || product.category,
      },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.log("Error in updateProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getReviewsAnalytics = async (req, res) => {
  try {
    const products = await Product.find({ isWishlistItem: { $ne: true } });

    let totalReviews = 0;
    let totalRating = 0;

    products.forEach((product) => {
      totalReviews += product.reviews.length;
      totalRating += product.averageRating * product.reviews.length;
    });

    const averageRating =
      totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

    res.json({
      totalReviews,
      averageRating: parseFloat(averageRating),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
