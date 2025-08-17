// components/Wishlist.jsx
import { useEffect, useState } from "react";
import axios from "../lib/axios";

const Wishlist = () => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const res = await axios.get("/wishlist");
        setVotes(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch wishlist votes:", err);
        setLoading(false);
      }
    };

    fetchVotes();
  }, []);

  if (loading) return <p className="text-gray-300">Loading wishlist...</p>;

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-emerald-400">
        Wishlist Votes
      </h2>
      {votes.length === 0 ? (
        <p className="text-gray-300">No votes yet.</p>
      ) : (
        <ul className="space-y-3">
          {votes.map((item) => (
            <li
              key={item._id}
              className="flex justify-between bg-gray-800 p-3 rounded-md hover:bg-gray-700 transition"
            >
              <span className="text-gray-200">{item.productId.name}</span>
              <span className="text-emerald-400 font-bold">
                {item.count} votes
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
