import Product from "../models/product.model.js";

export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // name
        { description: { $regex: query, $options: "i" } }, // description
        { category: { $regex: query, $options: "i" } }, // category
      ],
    });

    res.json(products);
  } catch (error) {
    console.error("Error in searchProducts:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
