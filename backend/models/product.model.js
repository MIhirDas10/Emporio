import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: {
      type: String,
      required: function () {
        return !this.isWishlistItem;
      },
    },
    price: {
      type: Number,
      min: 0,
      required: function () {
        return !this.isWishlistItem;
      },
    },
    image: {
      type: String,
      required: function () {
        return !this.isWishlistItem;
      },
    },
    category: {
      type: String,
      required: function () {
        return !this.isWishlistItem;
      },
    },
    isFeatured: { type: Boolean, default: false },
    isFree: { type: Boolean, default: false },

    // Voting system fields
    votes: {
      type: Number,
      default: 0,
    },
    isWishlistItem: { type: Boolean, default: false },

    // NEW: Track which users voted for this product
    votedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // existing fields
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.isFree) {
    this.price = 0;
  }
  next();
});

productSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = sum / this.reviews.length;
  }
  return this.averageRating;
};

const Product = mongoose.model("Product", productSchema);
export default Product;
