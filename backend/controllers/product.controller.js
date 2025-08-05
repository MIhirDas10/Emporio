import mongoose from "mongoose";
import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";

// gets all the product from db
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
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
