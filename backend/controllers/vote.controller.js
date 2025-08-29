import Product from "../models/product.model.js";

// NEW: Get user's voted products
export const getUserVotedProducts = async (req, res) => {
  const { userId } = req.params;

  try {
    const products = await Product.find({
      isWishlistItem: true,
      votedBy: userId,
    }).select("_id");

    const productIds = products.map((p) => p._id.toString());

    res.json({
      success: true,
      productIds,
    });
  } catch (error) {
    console.error("Error fetching user votes:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user votes",
    });
  }
};

// UPDATED: Submit votes with user tracking
export const submitVotes = async (req, res) => {
  const { selected } = req.body;
  const userId = req.user._id; // From auth middleware

  if (!Array.isArray(selected) || selected.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No products selected for voting",
    });
  }

  try {
    // Check which products user has already voted for
    const alreadyVoted = await Product.find({
      _id: { $in: selected },
      isWishlistItem: true,
      votedBy: userId,
    }).select("_id name");

    if (alreadyVoted.length > 0) {
      return res.status(400).json({
        success: false,
        message: `You have already voted for: ${alreadyVoted
          .map((p) => p.name)
          .join(", ")}`,
      });
    }

    // Update votes and add user to votedBy array
    const bulkOps = selected.map((productId) => ({
      updateOne: {
        filter: { _id: productId, isWishlistItem: true },
        update: {
          $inc: { votes: 1 },
          $addToSet: { votedBy: userId }, // Add user to votedBy array
        },
        upsert: false,
      },
    }));

    const result = await Product.bulkWrite(bulkOps);

    res.json({
      success: true,
      message: `Successfully voted for ${selected.length} product${
        selected.length === 1 ? "" : "s"
      }`,
      votesUpdated: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating votes:", error);
    res.status(500).json({
      success: false,
      message: "Error processing votes",
    });
  }
};

// Get top voted wishlist items for admin leaderboard
export const getTopVotedProducts = async (req, res) => {
  try {
    const topProducts = await Product.find({ isWishlistItem: true }) // Only wishlist items
      .sort({ votes: -1 })
      .limit(3)
      .select("name votes _id");

    res.json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    console.error("Error fetching top voted products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching top voted products",
    });
  }
};

// Get all wishlist items with their vote counts (for the wishlist display)
export const getProductsWithVotes = async (req, res) => {
  try {
    const products = await Product.find({ isWishlistItem: true }) // Only wishlist items
      .select("name votes _id")
      .sort({ votes: -1 });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products with votes:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
    });
  }
};

// wishlist item (for admin to create voteable products)
export const addWishlistItem = async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Product name is required",
    });
  }

  try {
    // Check if wishlist item with this name already exists
    const existingProduct = await Product.findOne({
      name: name.trim(),
      isWishlistItem: true,
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Wishlist item with this name already exists",
      });
    }

    // Create new wishlist item (not a full product)
    const newWishlistItem = new Product({
      name: name.trim(),
      votes: 0,
      isWishlistItem: true, // Mark as wishlist item
      // Set minimal required fields for wishlist items
      description: `Customer-requested product idea: ${name.trim()}`,
      price: 0,
      category: "wishlist-item",
      image: "https://via.placeholder.com/300x200?text=Wishlist+Item",
    });

    await newWishlistItem.save();

    res.json({
      success: true,
      message: "Wishlist item added successfully",
      data: newWishlistItem,
    });
  } catch (error) {
    console.error("Error adding wishlist item:", error);
    res.status(500).json({
      success: false,
      message: "Error adding wishlist item",
    });
  }
};

// Delete wishlist item
export const deleteWishlistItem = async (req, res) => {
  const { id } = req.params;

  try {
    // Only delete if it's a wishlist item, not an actual product
    const deletedProduct = await Product.findOneAndDelete({
      _id: id,
      isWishlistItem: true,
    });

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    res.json({
      success: true,
      message: "Wishlist item removed successfully",
    });
  } catch (error) {
    console.error("Error deleting wishlist item:", error);
    res.status(500).json({
      success: false,
      message: "Error removing wishlist item",
    });
  }
};

// Get only actual products (not wishlist items) for regular product operations
export const getActualProducts = async (req, res) => {
  try {
    const products = await Product.find({ isWishlistItem: { $ne: true } }) // Exclude wishlist items
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching actual products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
    });
  }
};
