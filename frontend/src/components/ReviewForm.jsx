import { useState } from "react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { useUserStore } from "../stores/useUserStore";

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to add a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This handles cookies/auth
        body: JSON.stringify({ rating, comment }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Review added successfully!");
        setRating(0);
        setComment("");
        onReviewSubmitted?.();
      } else {
        toast.error(data.message || "Failed to add review");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== "customer") {
    return null;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-6">
      <h3 className="text-xl font-semibold text-white mb-4">
        Rate this product
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div className="mb-4">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={28}
                className={`cursor-pointer ${
                  star <= rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-500"
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {rating > 0
              ? `You rated: ${rating} out of 5 stars`
              : "Click stars to rate"}
          </p>
        </div>

        {/* Comment */}
        <div className="mb-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
            rows="3"
            placeholder="Write your review (optional)..."
            maxLength="500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
