// src/components/PostForm.jsx
import { useState } from "react";
import { useCommunityStore } from "../stores/useCommunityStore";

const PostForm = () => {
  const createPost = useCommunityStore((state) => state.createPost);
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    await createPost({ content }); // role refreshes automatically
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts..."
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white"
      >
        Post
      </button>
    </form>
  );
};

export default PostForm;
