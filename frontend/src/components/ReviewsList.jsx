import { useState, useEffect } from "react";
import { Star, User } from "lucide-react";
import { motion } from "framer-motion";

const ReviewsList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      // You'll need to create this public endpoint
      const response = await fetch(`/api/products/${productId}/reviews/public`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
        }`}
      />
    ));
  };

  if (loading) {
    return <div className="text-white">Loading reviews...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">
        Customer Reviews ({reviews.length})
      </h3>

      {reviews.length === 0 ? (
        <p className="text-gray-400">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review._id}
              className="bg-gray-700 p-4 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <User size={18} className="text-gray-400" />
                  <span className="text-white font-medium">
                    {review.user?.name || "Anonymous"}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {renderStars(review.rating)}
                </div>
              </div>

              {review.comment && (
                <p className="text-gray-300 mt-2">{review.comment}</p>
              )}

              <p className="text-xs text-gray-500 mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
